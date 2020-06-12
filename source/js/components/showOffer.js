export default function showOffer(
  creditSum,
  monthlyPayment,
  interestRate,
  requiredIncome
) {
  const offer = document.querySelector(".offer");
  const creditSumOutput = document.querySelector(".terms__value_credit-sum");
  const monthlyPaymentOutput = document.querySelector(
    ".terms__value_monthly-payment"
  );
  const interestRateOutput = document.querySelector(
    ".terms__value_interest-rate"
  );
  const requiredIncomeOutput = document.querySelector(
    ".terms__value_required-income"
  );

  creditSumOutput.textContent = creditSum;
  monthlyPaymentOutput.textContent = monthlyPayment;
  interestRateOutput.textContent = interestRate;
  requiredIncomeOutput.textContent = requiredIncome;
}
