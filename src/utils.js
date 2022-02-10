const formatDate = (stringDate) => {
	return stringDate.slice(0, 10)
}

const isEmpty = (obj) => {
    for (let key in obj) {
        return true;
    }
    return false;
}

const emptyInput = (value) => {
    if (value === null) {
        return ""
    }
    return value
}

export { formatDate, isEmpty, emptyInput }