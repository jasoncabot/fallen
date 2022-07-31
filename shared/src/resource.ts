import { StructureData } from "@app/shared/structures";

const calculateIncome = (province, category) => {
    // TODO: need to take the current technology
    return Object.values(province.structures || {}).reduce((total, structure) => {
        const reference = StructureData[(structure as any).kind.category];
        if (reference.production.category !== category) return total;
        return total + reference.production.value;
    }, 0);
}

const calculateTotalIncome = (game, category) => {
    return Object.values(game.provinces)
        .filter((p: any) => p.owner === game.player.owner)
        .map(p => calculateIncome(p, category))
        .reduce((total: number, current: number) => total + current);
}

const hasStructureOfType = (type) => {
    return (province) => {
        return Object.values(province.structures || {}).find((s: any) => s.kind.type === type);
    }
}

const countStructureOfType = (type) => {
    return (province) => {
        return Object.values(province.structures || {}).filter((s: any) => s.kind.type === type).length;
    }
}

const countUnitsInside = (province) => {
    return Object.values(province.structures || {}).reduce((total: number, structure: any) => {
        return total + (Object.values(structure.units || {})).length;
    }, 0);
}

const countUnitsOutside = (province) => {
    return Object.values(province.units || {}).length;
}

export {
    calculateIncome,
    calculateTotalIncome,
    hasStructureOfType,
    countUnitsInside,
    countUnitsOutside,
    countStructureOfType
};
