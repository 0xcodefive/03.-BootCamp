// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract Note {
    //Мы можем писать заметки а также читать наши заметки
    string myNote; //state variable (состояние переменная)

    //модификаторы доступа: private, internal, extarnal, public
    //Если public -> автоматический создается геттер функция

    //reference type (ссылочных типов) локальных переменных пишем memory
    function setNote(string memory _note) public {
        myNote = _note;
    }

    function getNote() public view returns (string memory) {
        //view = gasless (бесплатной)
        return myNote;
    }

    function pureNote(string memory _pureNote)
        public
        pure
        returns (string memory)
    {
        //pure вы даже не читаете state
        return _pureNote;
    }
}
