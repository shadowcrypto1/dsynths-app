import numbro from 'numbro'

export const formatDollarAmount = (number = undefined, digits = 2, round = false) => {
  if (number === 0) return '$0.00'
  if (!number) return '-'
  if (number < 0.001) {
    return '<$0.001'
  }
  return numbro(number).formatCurrency({ average: round, mantissa: digits })
}

export const formatAmount = (number = undefined, digits = 2) => {
  if (number === 0) return '0'
  if (!number) return '-'
  if (number < 0.01) {
    return '<0.01'
  }
  const nf = new Intl.NumberFormat()
  return nf.format(parseFloat(number.toFixed(number > 1000 ? 0 : digits)))
}
