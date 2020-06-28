export default function showOffer(
  creditSum,
  monthlyPayment,
  interestRate,
  requiredIncome,
  purpose,
  minCreditSum
) {
  const creditSumOutput = document.querySelector(".offer__value_credit-sum");
  const monthlyPaymentOutput = document.querySelector(
    ".offer__value_monthly-payment"
  );
  const interestRateOutput = document.querySelector(
    ".offer__value_interest-rate"
  );
  const requiredIncomeOutput = document.querySelector(
    ".offer__value_required-income"
  );
  const requestContainer = document.querySelector(".request-container");

  creditSumOutput.textContent = creditSum;
  monthlyPaymentOutput.textContent = monthlyPayment;
  interestRateOutput.textContent = interestRate;
  requiredIncomeOutput.textContent = requiredIncome;

  let title;
  let priceLabel;
  let creditSumLabel;

  if (purpose === "mortgage") {
    title = `Наш банк не выдаёт ипотечные кредиты меньше ${minCreditSum} рублей.`;
    priceLabel = "Стоимость недвижимости";
    creditSumLabel = "Сумма ипотеки";
  } else if (purpose === "car-credit") {
    title = `Наш банк не выдаёт автокредиты меньше ${minCreditSum} рублей.`;
    priceLabel = "Стоимость автомобиля";
    creditSumLabel = "Сумма автокредита";
  } else if (purpose === "consumer-credit") {
    title = "";
    priceLabel = "Сумма потребительского кредита";
    creditSumLabel = "Сумма кредита";
  }

  document.querySelector(".refuse__title").textContent = title;
  document.querySelector(".calculator__label_price").textContent = priceLabel;
  document.querySelector(
    ".offer__label_credit-sum"
  ).textContent = creditSumLabel;
}
