function formatRupiah(angka) {
  let Rupiah = new Intl.NumberFormat("en-ID", {
    style: "currency",
    currency: "IDR",
  });
  return Rupiah.format(angka);
}

module.exports = formatRupiah;
