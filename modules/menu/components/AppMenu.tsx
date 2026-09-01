'use client';

import React from 'react';

import AppMenuitem
from './AppMenuitem';

import {
    useMenu
}
from '@/modules/menu/hooks/useMenu';

const AppMenu = () => {

    const model =
        useMenu();

    return (

        <ul className="layout-menu">

            {
                model.map(
                    (
                        item,
                        i
                    ) => {

                        return (

                            <AppMenuitem

                                item={item}

                                root={true}

                                index={i}

                                key={
                                    item.label
                                }
                            />
                        );
                    }
                )
            }

        </ul>
    );
};

export default AppMenu;