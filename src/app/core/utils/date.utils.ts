export function normalizeDate(value: any): string | null {
  if (value == null) return null;

  if (Array.isArray(value)) {
    const [ano, mes, dia, hora = 0, minuto = 0, segundo = 0] = value;
    if ([ano, mes, dia].some(v => v == null)) return null;
    const d = new Date(ano, mes - 1, dia, hora, minuto, segundo);
    return isNaN(d.getTime()) ? null : d.toISOString();
  }

  if (typeof value === 'object') {
    const y = (value.year ?? value.ano) as number | undefined;
    const m = (value.month ?? value.mes) as number | undefined;
    const dday = (value.day ?? value.dia) as number | undefined;
    const h = value.hour ?? value.hora ?? 0;
    const min = value.minute ?? value.minuto ?? 0;
    if (y != null && m != null && dday != null) {
      const d = new Date(y, m - 1, dday, h, min);
      return isNaN(d.getTime()) ? null : d.toISOString();
    }
    return null;
  }

  if (typeof value === 'string') {
    let d = new Date(value);
    if (!isNaN(d.getTime())) return d.toISOString();

    const withT = value.replace(' ', 'T');
    d = new Date(withT);
    if (!isNaN(d.getTime())) return d.toISOString();

    const onlyDate = new Date(value + 'T00:00:00');
    if (!isNaN(onlyDate.getTime())) return onlyDate.toISOString();

    return null;
  }

  if (typeof value === 'number') {
    const d = new Date(value);
    return isNaN(d.getTime()) ? null : d.toISOString();
  }

  return null;
}
