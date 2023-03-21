/***************************************************
Вызываем call функцию контракта

Принимаем аргументы:
    contract - контракт из ethers.ethers.Contract
    funcName - название функции как в ABI
    value - плата в wei
    args - аргументы в формате array

Возвращаем значения:
    txResponse - ответ выполнения функции
    txReceipt - номер транзакции в блокчейне
***************************************************/
export async function _callFunction(contract, funcName, value, args) {
  // Проверяем, существует ли функция с заданным именем
  if (!contract[funcName]) {
    console.error(`Contract does not have function ${funcName}`);
    return;
  }
  // Вызываем функцию с заданным именем, передавая указанное значение и аргументы
  let txResponse;
  if (value) {
    txResponse = await contract[funcName](...args, { value });
  } else {
    txResponse = await contract[funcName](...args);
  }
  // Ждем, пока транзакция будет подтверждена и выводим результат
  const txReceipt = await txResponse.wait(1);
  return {
    txResponse: txResponse,
    txReceipt: txReceipt,
  };
}

/***************************************************
Вызываем pure функцию контракта
  
Принимаем аргументы:
    contract - контракт из ethers.ethers.Contract
    funcName - название функции как в ABI
    args - аргументы в формате array
  
Возвращаем значения:
    txResponse - ответ выполнения функции
***************************************************/
export async function _pureFunction(contract, funcName, args) {
  // Проверяем, существует ли функция с заданным именем
  if (!contract[funcName]) {
    console.error(`Contract does not have function ${funcName}`);
    return;
  }
  // Вызываем функцию с заданным именем, передавая аргументы
  const txResponse = await contract[funcName](...args);

  return {
    txResponse: txResponse,
  };
}
