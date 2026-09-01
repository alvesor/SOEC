'use client';

import React
from 'react';

import {
    FileUpload
}
from 'primereact/fileupload';

interface Props {

    multiple?: boolean;

    accept?: string;

    maxFileSize?: number;

    chooseLabel?: string;

    onUpload: (
        files: File[]
    ) => Promise<void>;
}

const DocumentoUpload = (
    props: Props
) => {

    async function
    handleUpload(
        event: any
    ) {

        const files =
            event.files || [];

        if (
            files.length === 0
        ) {
            return;
        }

        await props.onUpload(
            files
        );
    }

    return (

        <FileUpload

            name="documento"

            mode="basic"

            customUpload

            auto

            multiple={
                props.multiple
            }

            accept={
                props.accept
            }

            maxFileSize={
                props.maxFileSize
            }

            chooseLabel={
                props.chooseLabel
                || 'Seleccionar'
            }

            uploadHandler={
                handleUpload
            }

        />
    );
};

export default DocumentoUpload;