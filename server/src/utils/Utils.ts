export const groupBy = (data: any, key: string): { [key: string]: any } => {
  return data.reduce(function (acc: any, item: any) {
    (acc[item[key]] = acc[item[key]] || []).push(item);
    return acc;
  }, {});
};

export function unique(array: any[], propertyName: string) {
  return array.filter(
    (e, i) => array.findIndex((a) => a[propertyName] === e[propertyName]) === i
  );
}
