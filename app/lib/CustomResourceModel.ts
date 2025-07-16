import { ResourceModel } from '@bryntum/calendar';

export interface CustomResourceModelType extends ResourceModel {
    _editable?: string;
    component?: string;
    _uid?: string;
}

export class CustomResourceModel extends ResourceModel {
    static get fields() {
        return [
            { name : 'component', type : 'string', defaultValue : '' },
            { name : '_uid', type : 'string', defaultValue : '' },
            { name : '_editable', type : 'string', defaultValue : '' }
        ];
    }
}
