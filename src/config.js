const CLIENTID = 'a9506be4-ff5f-49f8-bea8-f9b25c79cf54'

const COMPANY = 'Компания'

const RESPONSIBLE_OFFICER_TYPES = {
    ID: '_id',
	EMAIL: 'email',
    FIRSTNAME: 'firstName',
	LASTNAME: 'lastName',
	PASSWORD: 'password',
    CLIENTID: 'clientId',
    APPROVED: 'approved',
}

const THEFT_REPORT_TYPES = {
	STATUS: 'status',
    LICENSENUMBER: 'licenseNumber',
	TYPE: 'type',
	OWNERFULLNAME: 'ownerFullName',
    CLIENTID: 'clientId',
    CREATEDAT: 'createdAt',
    UPDATEDAT: 'updatedAt',
    COLOR: 'color',
    DATE: 'date',
    OFFICER: 'officer',
    DESCRIPTION: 'description',
    RESOLUTION: 'resolution',
}


const RESPONSIBLE_OFFICER_COPY = {
    [RESPONSIBLE_OFFICER_TYPES.ID]: 'ID',
	[RESPONSIBLE_OFFICER_TYPES.EMAIL]: 'E-mail',
    [RESPONSIBLE_OFFICER_TYPES.FIRSTNAME]: 'Имя',
	[RESPONSIBLE_OFFICER_TYPES.LASTNAME]: 'Фамилия',
	[RESPONSIBLE_OFFICER_TYPES.PASSWORD]: 'Пароль',
    [RESPONSIBLE_OFFICER_TYPES.CLIENTID]: 'Client ID',
    [RESPONSIBLE_OFFICER_TYPES.APPROVED]: 'Статус сотрудника',
}

const THEFT_REPORT_COPY = {
	[THEFT_REPORT_TYPES.STATUS]: 'Статус',
    [THEFT_REPORT_TYPES.LICENSENUMBER]: 'Номер лицензии',
	[THEFT_REPORT_TYPES.TYPE]: 'Тип велосипеда',
	[THEFT_REPORT_TYPES.OWNERFULLNAME]: 'ФИО пользователя',
    [THEFT_REPORT_TYPES.CLIENTID]: 'Client ID',
    [THEFT_REPORT_TYPES.CREATEDAT]: 'Дата создания сообщения',
    [THEFT_REPORT_TYPES.UPDATEDAT]: 'Дата последнего обновления сообщения',
    [THEFT_REPORT_TYPES.COLOR]: 'Цвет велосипеда',
    [THEFT_REPORT_TYPES.DATE]: 'Дата кражи',
    [THEFT_REPORT_TYPES.OFFICER]: 'Ответственный сотрудник',
    [THEFT_REPORT_TYPES.DESCRIPTION]: 'Дополнительный комментарий',
    [THEFT_REPORT_TYPES.RESOLUTION]: 'Завершающий комментарий',
}

const MESSAGE_STATUS = {
    NEW: 'new',
    IN_PROGRESS: 'in_progress',
    DONE: 'done',
}

const BIKE_TYPE = {
    GENERAL: 'general',
    SPORT: 'sport',
}

export { CLIENTID, COMPANY, RESPONSIBLE_OFFICER_TYPES, THEFT_REPORT_TYPES, RESPONSIBLE_OFFICER_COPY, THEFT_REPORT_COPY, MESSAGE_STATUS, BIKE_TYPE}