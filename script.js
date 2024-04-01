const form = document.querySelector('.add');
const incomelist = document.querySelector('ul.income-list');
const expenselist = document.querySelector('ul.expense-list');
const income = document.getElementById('income');
const expense = document.getElementById('expense');
const balance = document.getElementById('balance');
const alert = document.getElementById('alert')
let transactions = localStorage.getItem("transactions") !== null ? JSON.parse(localStorage.getItem("transactions")) : [];

function addTransaction(source,amount){
    const time = new Date();
    const transaction = {
        id : Math.random()*100000,
        source : source,
        amount : amount,
        time : `${time.toLocaleTimeString()} ${time.toLocaleDateString()}`
    };
    transactions.push(transaction)
    updatedstatistics()
    localStorage.setItem("transactions",JSON.stringify(transactions))
    addTransactionDOM(transaction.id,source,amount,transaction.time);

}

function generateTemplate(id,source,amount,time){
   return `<li data-id="${id}">
    <p>
        <span>${source}</span>
        <span id="time">${time}</span>
    </p>
    &#8377<span>${Math.abs(amount)}</span>
    <i class="bi bi-trash delete"></i>
</li>`
}
function addTransactionDOM(id,source,amount,time){
    if(amount > 0){
        incomelist.innerHTML += generateTemplate(id,source,amount,time)
    }
    else{
        expenselist.innerHTML += generateTemplate(id,source,amount,time)
    }
}
form.addEventListener("submit",event =>{
    event.preventDefault();
    if (form.source.value == "" || form.amount.value == ""){
        form.classList.remove('.hided');
        form.querySelector('p').innerText = "please give correct information...";
        form.reset()
    }
    else{
        addTransaction(form.source.value,Number(form.amount.value));
        form.classList.add('.hided');
    }
    form.reset();
})

function getTransaction(){
    transactions.forEach(transaction => {
        if (transaction.amount > 0){
            incomelist.innerHTML += generateTemplate(transaction.id,transaction.source,transaction.amount,transaction.time);
        }
        else{
            expenselist.innerHTML += generateTemplate(transaction.id,transaction.source,transaction.amount,transaction.time);
        }
        
    });
}
getTransaction();

function deleteTransaction(id){
    transactions = transactions.filter(transaction =>{
        return transaction.id !== id;
    });
    updatedstatistics()
    localStorage.setItem("transactions" , JSON.stringify(transactions));
}

incomelist.addEventListener("click", event =>{
    if(event.target.classList.contains("delete")){
        event.target.parentElement.remove();
        deleteTransaction(Number(event.target.parentElement.dataset.id));
    }
})

expenselist.addEventListener("click", event =>{
    if(event.target.classList.contains("delete")){
        event.target.parentElement.remove();
        deleteTransaction(Number(event.target.parentElement.dataset.id));
    }
})

function updatedstatistics(){
    const updatedIncome = transactions
                                .filter(transaction => transaction.amount > 0)
                                .reduce((total,transaction) => total+=transaction.amount,0);
    const updatedExpense = transactions
                                .filter(transaction => transaction.amount < 0)
                                .reduce((total,transaction) => total += Math.abs(transaction.amount),0);

    balance.textContent = updatedIncome-updatedExpense;
    income.textContent = updatedIncome;
    expense.textContent = updatedExpense;
    
}
updatedstatistics()