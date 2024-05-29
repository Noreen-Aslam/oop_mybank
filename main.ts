import { faker } from "@faker-js/faker";
import chalk from "chalk";
import inquirer from "inquirer";

// Customer Class
class Customer {
    firstName: string;
    lastName: string;
    age: number;
    gender: string;
    mobNumber: number;
    accNumber: number;

    constructor(fName: string, lName: string, age: number, gender: string, mob: number, acc: number) {
        this.firstName = fName;
        this.lastName = lName;
        this.age = age;
        this.gender = gender;
        this.mobNumber = mob;
        this.accNumber = acc;
    }
}

// BankAccount Interface
interface BankAccount {
    accNumber: number;
    balance: number;
}

// Bank Class
class Bank {
    customers: Customer[] = [];
    accounts: BankAccount[] = [];

    addCustomer(obj: Customer) {
        this.customers.push(obj);
    }

    addAccountNumber(obj: BankAccount) {
        this.accounts.push(obj);
    }

    transaction(accObj: BankAccount) {
        const newAccounts = this.accounts.filter(acc => acc.accNumber !== accObj.accNumber);
        this.accounts = [...newAccounts, accObj];
    }
}

let myBank = new Bank();

// Create customers
for (let i: number = 1; i <= 3; i++) {
    const fName = faker.person.firstName('male');
    const lName = faker.person.lastName();
    const num = parseInt(faker.phone.number("3#########"));
    const cus = new Customer(fName, lName, 25 * i, "male", num, 1000 + i);
    myBank.addCustomer(cus);
    myBank.addAccountNumber({ accNumber: cus.accNumber, balance: 100 * i });
}

// Bank Functionality
async function bankService(bank: Bank) {
    do {
        const service = await inquirer.prompt({
            type: "list",
            name: "select",
            message: "Please Select the Service",
            choices: ["View Balance", "Cash Withdraw", "Cash Deposit", "Exit"],
        });

        // View Balance
        if (service.select === "View Balance") {
            const res = await inquirer.prompt({
                type: "input",
                name: "num",
                message: "Please enter your account number",
            });

            const account = myBank.accounts.find(acc => acc.accNumber === parseInt(res.num));
            if (!account) {
                console.log(chalk.red.bold.italic("Invalid Account Number"));
            } else {
                const customer = myBank.customers.find(item => item.accNumber === account.accNumber);
                console.log(`Dear ${chalk.green.italic(customer?.firstName)} ${chalk.green.italic(customer?.lastName)}, your Account Balance is ${chalk.bold.blueBright(
                    `$${account.balance}`
                )}`);
            }
        }

        // Cash Withdraw
        if (service.select === "Cash Withdraw") {
            const res = await inquirer.prompt({
                type: "input",
                name: "num",
                message: "Please enter your account number",
            });

            const account = myBank.accounts.find(acc => acc.accNumber === parseInt(res.num));
            if (!account) {
                console.log(chalk.red.bold.italic("Invalid Account Number"));
            } else {
                const ans = await inquirer.prompt({
                    type: "number",
                    message: "Please enter your amount.",
                    name: "rupee",
                });
                if (ans.rupee > account.balance) {
                    console.log(chalk.red.bold("Insufficient balance..."));
                } else {
                    const newBalance = account.balance - ans.rupee;
                    // transaction method call
                    bank.transaction({ accNumber: account.accNumber, balance: newBalance });
                    console.log(chalk.green.bold(`Withdrawal successful. New balance is $${newBalance}.`));
                }
            }
        }

        // Cash Deposit
        if (service.select === "Cash Deposit") {
            const res = await inquirer.prompt({
                type: "input",
                name: "num",
                message: "Please enter your account number",
            });

            const account = myBank.accounts.find(acc => acc.accNumber === parseInt(res.num));
            if (!account) {
                console.log(chalk.red.bold.italic("Invalid Account Number"));
            } else {
                const ans = await inquirer.prompt({
                    type: "number",
                    message: "Please enter your amount.",
                    name: "rupee",
                });
                const newBalance = account.balance + ans.rupee;
                // transaction method call
                bank.transaction({ accNumber: account.accNumber, balance: newBalance });
                console.log(chalk.green.bold(`Deposit successful. New balance is $${newBalance}.`));
            }
        }

        // Exit
        if (service.select === "Exit") {
            break;
        }
    } while (true);
}

bankService(myBank);
