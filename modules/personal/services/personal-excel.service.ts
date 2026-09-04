// modules/personal/services/personal-excel.service.ts

import ExcelJS from 'exceljs';
import { guardarPersonal } from './personal.service';
import type { CatalogoItem, FilaCargaMasiva, ResultadoCargaMasiva } from '../types/personal.types';

const HOJA_DATOS = 'Personal';
const HOJA_LISTA_TIPOS = 'ListaTipos';
const HOJA_META = '_meta';
const ENCABEZADOS = ['Tipo Identificación', 'Identificación', 'Nombres', 'Apellidos'];
const FILAS_PLANTILLA = 500; // rango de filas con validación disponible

export async function generarPlantillaExcel(id_empresa: number, razonSocial: string, tiposIdentificacion: CatalogoItem[]) {
    /*
     * id_empresa SIEMPRE se inyecta aquí, de forma programática,
     * a partir de la sesión activa (empresa_activa). Nunca es un
     * campo editable por el usuario ni se expone en la hoja visible.
     */
    if (!id_empresa) {
        throw new Error('id_empresa es requerido para generar la plantilla.');
    }
    if (tiposIdentificacion.length === 0) {
        throw new Error('No hay tipos de identificación configurados (catalogo id_padre=2).');
    }

    const wb = new ExcelJS.Workbook();

    // ── Hoja de datos ──────────────────────────────────────────────────────
    const wsDatos = wb.addWorksheet(HOJA_DATOS);
    wsDatos.columns = [{ width: 22 }, { width: 18 }, { width: 25 }, { width: 25 }];
    wsDatos.addRow(ENCABEZADOS);
    wsDatos.getRow(1).font = { bold: true };

    // ── Hoja oculta con la lista de tipos de identificación válidos ─────────
    const wsLista = wb.addWorksheet(HOJA_LISTA_TIPOS);
    tiposIdentificacion.forEach((t, i) => {
        wsLista.getCell(`A${i + 1}`).value = t.nombre;
    });
    wsLista.state = 'veryHidden';

    // ── Validación de datos (dropdown estricto) en columna A de "Personal" ──
    const rangoLista = `'${HOJA_LISTA_TIPOS}'!$A$1:$A$${tiposIdentificacion.length}`;
    for (let fila = 2; fila <= FILAS_PLANTILLA + 1; fila++) {
        wsDatos.getCell(`A${fila}`).dataValidation = {
            type: 'list',
            allowBlank: true,
            formulae: [rangoLista],
            showErrorMessage: true,
            errorStyle: 'stop',
            errorTitle: 'Valor no válido',
            error: 'Selecciona un tipo de identificación de la lista.',
            showInputMessage: true,
            promptTitle: 'Tipo de identificación',
            prompt: 'Selecciona un valor de la lista desplegable.'
        };
    }

    // ── Metadata oculta: empresa destino y rol (solo lo indispensable) ──────
    const wsMeta = wb.addWorksheet(HOJA_META);
    wsMeta.getCell('A1').value = 'id_empresa';
    wsMeta.getCell('B1').value = id_empresa;
    wsMeta.getCell('A2').value = 'id_rol';
    wsMeta.getCell('B2').value = 4;
    wsMeta.state = 'veryHidden';

    const buffer = await wb.xlsx.writeBuffer();
    const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });

    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `plantilla_personal_${razonSocial.replace(/\s+/g, '_')}.xlsx`;
    a.click();
    URL.revokeObjectURL(url);
}

export async function leerArchivoCargaMasiva(file: File): Promise<{ id_empresa: number; filas: FilaCargaMasiva[] }> {
    const buffer = await file.arrayBuffer();
    const wb = new ExcelJS.Workbook();
    await wb.xlsx.load(buffer);

    const wsMeta = wb.getWorksheet(HOJA_META);
    if (!wsMeta) {
        throw new Error('El archivo no corresponde a la plantilla de carga de personal.');
    }

    const id_empresa = Number(wsMeta.getCell('B1').value);
    if (!id_empresa) {
        throw new Error('No se pudo determinar la empresa del archivo.');
    }

    const wsDatos = wb.getWorksheet(HOJA_DATOS);
    if (!wsDatos) {
        throw new Error('El archivo no contiene la hoja "Personal".');
    }

    const filas: FilaCargaMasiva[] = [];

    wsDatos.eachRow((row, numeroFila) => {
        if (numeroFila === 1) return; // encabezado

        const tipo_identificacion = String(row.getCell(1).value ?? '').trim();
        const identificacion = String(row.getCell(2).value ?? '').trim();
        const nombres = String(row.getCell(3).value ?? '').trim();
        const apellidos = String(row.getCell(4).value ?? '').trim();

        if (!tipo_identificacion && !identificacion && !nombres && !apellidos) return; // fila vacía

        filas.push({ fila: numeroFila, tipo_identificacion, identificacion, nombres, apellidos });
    });

    return { id_empresa, filas };
}

export async function procesarCargaMasiva(id_empresa: number, filas: FilaCargaMasiva[], tiposIdentificacion: CatalogoItem[]): Promise<ResultadoCargaMasiva> {
    const resultado: ResultadoCargaMasiva = { exitos: 0, errores: [] };

    for (const fila of filas) {
        try {
            if (!fila.identificacion || !fila.nombres || !fila.apellidos) {
                throw new Error('Faltan campos obligatorios.');
            }

            const tipo = tiposIdentificacion.find((t) => t.nombre.toLowerCase() === fila.tipo_identificacion.toLowerCase());
            if (!tipo) {
                throw new Error(`Tipo de identificación "${fila.tipo_identificacion}" no es válido.`);
            }

            await guardarPersonal(id_empresa, {
                id_tipo_identificacion: tipo.id_catalogo,
                identificacion: fila.identificacion,
                nombres: fila.nombres,
                apellidos: fila.apellidos,
                requiere_acceso: true
            });

            resultado.exitos++;
        } catch (err: any) {
            resultado.errores.push({ fila: fila.fila, motivo: err.message ?? 'Error desconocido' });
        }
    }

    return resultado;
}
