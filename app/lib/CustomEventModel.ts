import { EventModel } from '@bryntum/calendar';

export interface CustomEventModelType extends EventModel {
  _editable?: string;
  component?: string;
  _uid?: string;
}

export class CustomEventModel extends EventModel implements CustomEventModelType {
    static get fields() {
        return [
            { name : 'component', type : 'string', defaultValue : '' },
            { name : '_uid', type : 'string', defaultValue : '' },
            { name : '_editable', type : 'string', defaultValue : '' }
        ];
    }
}