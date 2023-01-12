const upperCaseFirst = (s: string) => s.substring(0, 1).toUpperCase() + s.substring(1);
export const cellTitle = (column: any) => {
    let colName = column.name;
    if (colName.endsWith("_id"))
        colName = column.name.substring(0, column.name.length - "_id".length);
    colName = colName.replaceAll('_', ' ');
    if (colName.startsWith('has') || colName.startsWith('is'))
        colName += "?";
    return upperCaseFirst(colName);
};
const pluralize = (s: string) => s.endsWith("s") ? s : s + "s";
export const toPluralTitle = (s: string) => upperCaseFirst(pluralize(s));