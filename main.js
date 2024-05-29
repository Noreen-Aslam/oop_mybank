"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const faker_1 = require("@faker-js/faker");
const chalk_1 = __importDefault(require("chalk"));
const inquirer_1 = __importDefault(require("inquirer"));
// Customer Class
class Customer {
    constructor(fName, lName, age, gender, mob, acc) {
        this.firstName = fName;
        this.lastName = lName;
        this.age = age;
        this.gender = gender;
        this.mobNumber = mob;
        this.accNumber = acc;
    }
}
// Bank Class
class Bank {
    constructor() {
        this.customers = [];
        this.accounts = [];
    }
    addCustomer(obj) {
        this.customers.push(obj);
    }
    addAccountNumber(obj) {
        this.accounts.push(obj);
    }
    transaction(accObj) {
        const newAccounts = this.accounts.filter(acc => acc.accNumber !== accObj.accNumber);
        this.accounts = [...newAccounts, accObj];
    }
}
let myBank = new Bank();
// Create customers
for (let i = 1; i <= 3; i++) {
    const fName = faker_1.faker.person.firstName('male');
    const lName = faker_1.faker.person.lastName();
    const num = parseInt(faker_1.faker.phone.number("3#########"));
    const cus = new Customer(fName, lName, 25 * i, "male", num, 1000 + i);
    myBank.addCustomer(cus);
    myBank.addAccountNumber({ accNumber: cus.accNumber, balance: 100 * i });
}
// Bank Functionality
function bankService(bank) {
    return __awaiter(this, void 0, void 0, function* () {
        do {
            const service = yield inquirer_1.default.prompt({
                type: "list",
                name: "select",
                message: "Please Select the Service",
                choices: ["View Balance", "Cash Withdraw", "Cash Deposit", "Exit"],
            });
            // View Balance
            if (service.select === "View Balance") {
                const res = yield inquirer_1.default.prompt({
                    type: "input",
                    name: "num",
                    message: "Please enter your account number",
                });
                const account = myBank.accounts.find(acc => acc.accNumber === parseInt(res.num));
                if (!account) {
                    console.log(chalk_1.default.red.bold.italic("Invalid Account Number"));
                }
                else {
                    const customer = myBank.customers.find(item => item.accNumber === account.accNumber);
                    console.log(`Dear ${chalk_1.default.green.italic(customer === null || customer === void 0 ? void 0 : customer.firstName)} ${chalk_1.default.green.italic(customer === null || customer === void 0 ? void 0 : customer.lastName)}, your Account Balance is ${chalk_1.default.bold.blueBright(`$${account.balance}`)}`);
                }
            }
            // Cash Withdraw
            if (service.select === "Cash Withdraw") {
                const res = yield inquirer_1.default.prompt({
                    type: "input",
                    name: "num",
                    message: "Please enter your account number",
                });
                const account = myBank.accounts.find(acc => acc.accNumber === parseInt(res.num));
                if (!account) {
                    console.log(chalk_1.default.red.bold.italic("Invalid Account Number"));
                }
                else {
                    const ans = yield inquirer_1.default.prompt({
                        type: "number",
                        message: "Please enter your amount.",
                        name: "rupee",
                    });
                    if (ans.rupee > account.balance) {
                        console.log(chalk_1.default.red.bold("Insufficient balance..."));
                    }
                    else {
                        const newBalance = account.balance - ans.rupee;
                        // transaction method call
                        bank.transaction({ accNumber: account.accNumber, balance: newBalance });
                        console.log(chalk_1.default.green.bold(`Withdrawal successful. New balance is $${newBalance}.`));
                    }
                }
            }
            // Cash Deposit
            if (service.select === "Cash Deposit") {
                const res = yield inquirer_1.default.prompt({
                    type: "input",
                    name: "num",
                    message: "Please enter your account number",
                });
                const account = myBank.accounts.find(acc => acc.accNumber === parseInt(res.num));
                if (!account) {
                    console.log(chalk_1.default.red.bold.italic("Invalid Account Number"));
                }
                else {
                    const ans = yield inquirer_1.default.prompt({
                        type: "number",
                        message: "Please enter your amount.",
                        name: "rupee",
                    });
                    const newBalance = account.balance + ans.rupee;
                    // transaction method call
                    bank.transaction({ accNumber: account.accNumber, balance: newBalance });
                    console.log(chalk_1.default.green.bold(`Deposit successful. New balance is $${newBalance}.`));
                }
            }
            // Exit
            if (service.select === "Exit") {
                break;
            }
        } while (true);
    });
}
bankService(myBank);
