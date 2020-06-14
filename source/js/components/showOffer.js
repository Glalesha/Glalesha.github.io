export default function showOffer(
  creditSum,
  monthlyPayment,
  interestRate,
  requiredIncome
) {
  const offer = document.querySelector(".offer");
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

  creditSumOutput.textContent = creditSum;
  monthlyPaymentOutput.textContent = monthlyPayment;
  interestRateOutput.textContent = interestRate;
  requiredIncomeOutput.textContent = requiredIncome;
}
