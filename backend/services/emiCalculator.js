function calculateEMI(principal, annualInterestRate, tenureInMonths) {
    const monthlyInterestRate = annualInterestRate / 12 / 100;
    const emi = (principal * monthlyInterestRate * Math.pow(1 + monthlyInterestRate, tenureInMonths)) / 
                (Math.pow(1 + monthlyInterestRate, tenureInMonths) - 1);
    return emi;
}

module.exports = {
    calculateEMI
};