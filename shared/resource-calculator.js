const StructureData = require('./structures');

const calculateIncome = (province, category) => {
    // TODO: need to take the current technology 
    return Object.values(province.structures || {}).reduce((total, structure) => {
        const reference = StructureData[structure.kind.category];
        if (reference.production.category !== category) return total;
        return total + reference.production.value;
    }, 0);
}

const hasStructureOfType = (type) => {
    return (province) => {
        return Object.values(province.structures || {}).find(s => s.kind.type === type);
    }
}

const countStructureOfType = (type) => {
    return (province) => {
        return Object.values(province.structures || {}).filter(s => s.kind.type === type).length;
    }
}

const countUnitsInside = (province) => {
    return Object.values(province.structures || {}).reduce((total, structure) => {
        return total + (Object.values(structure.units || {})).length;
    }, 0);
}

const countUnitsOutside = (province) => {
    return Object.values(province.units || {}).length;
}

module.exports = {
    calculateIncome,
    hasStructureOfType,
    countUnitsInside,
    countUnitsOutside,
    countStructureOfType
};
