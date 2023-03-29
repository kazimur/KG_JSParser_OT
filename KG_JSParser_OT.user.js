// ==UserScript==
// @name           KG_JSParser_OT
// @version        1.0.0
// @namespace      klavogonki
// @author         NIN, kazimur
// @description    JSParser подсчёт для "Обычного" турнира
// @include        http*://klavogonki.ru/*
// @grant          none
// ==/UserScript==

(function() {
    console.log("load jsparser OT");
    let min_out_finishes = 1;
    let min_finishes = 9;
    let max_finishes = 10;

    let rule_ot = {};
    rule_ot.command = "OT";
    rule_ot.chat = false;

    rule_ot.columns_speed = (table) => {

        for (let _i of table.items(table)) {
            let _id = _i[0];
            let _value = _i[1];
            table[_id]["points"] = table[_id]["avg_speed"];
            if (table[_id]["num_finishes"]<min_finishes && table.valid_game_numbers.length>=max_finishes) {
                table[_id]["out"] = true;
            }
            if (table[_id]["num_finishes"]<min_out_finishes) {
                delete table[_id];
            }
        }

        let sort_func = (x) => x[1]["points"];

        let columns=[];
        columns.push({"title":"Место","data": (x) => x["sort_position"]});
        columns.push({"title":"Ник","data": (x) => table.list_get_last_not_none(x["name"]),"add_class":"kgjs-nick"});
        columns.push({"title":"Средняя скорость","data": (x) => x["points"].toFixed(2)});
        for (const f of table.valid_game_numbers) {
            columns.push({"title":f.n.toString(),"data": (x,_i=f.i) => x["speed"][_i],"game":f.i});
        }

        return columns;
    };

    rule_ot.tables = [];
    rule_ot.tables.push({"columns":rule_ot.columns_speed});

let inject_css = document.createElement("style");
inject_css.setAttribute("type", "text/css");
inject_css.innerHTML = ''+
'table[id^=kgjs_calc_table][class^=ot] td, '+
'table[id^=kgjs_calc_table][class^=ot] th {'+
    'padding-left: 4px;'+
    'padding-right: 4px;'+
    'padding-top: 2px;'+
    'padding-bottom: 2px;'+
'}'+
'#kgjs_main_block table[class^="ot"],'+
'#kgjs_main_block table[class^="ot"] * {'+
    'box-sizing: content-box;'+
    'border-collapse: collapse;'+
'}'+
'table[class^="ot"] tbody,'+
'table[class^="ot"] thead {'+
    'border-style: solid;'+
    'border-color: #000;'+
    'border-width: 3px;'+
'}'+
'#kgjs_main_block table[class^="ot"] {'+
    'border-collapse: collapse;'+
    'font-size: 14px;'+
    'line-height: 150%;'+
    'display: inline-block;'+
    'font-variant: normal;'+
    'font-family: Arial, Helvetica, sans-serif;'+
'}'+
'table[class^="ot"] td, table[class^="ot"] th {'+
    'padding: 2px;'+
    'border-style: solid;'+
    'border-color: #000;'+
    'border-width: 1px;'+
    'white-space: nowrap;'+
    'text-align: center;'+
'}'+
'table[class^="ot"] td.bg-title, '+
'table[class^="ot"] th.bg-title {'+
    'font-weight: bold;'+
    'min-width: 30px;'+
    'max-width: 80px;'+
    'white-space: normal;'+
    'hyphens: manual;'+
    'overflow-wrap: break-word;'+
    'background-color: #d9d9d9;'+
'}'+
'table[class^="ot"] col {'+
    'border: 2px solid black;'+
'}'+
'table[class^="ot"] thead {'+
    'font-size: 24px;'+
'}'+
'table[class^="ot"] thead th {'+
    'padding: 10px;'+
'}'+
'#kgjs_custom_block[class^="ot"] table[class^=ot] .kgjs-nick {'+
    'font-weight:bold;'+
    'min-width: 100px;'+
    'padding-left: 10px;'+
    'padding-right: 10px;'+
    'text-align: left;'+
'}'+
'table[class^="ot"] tr {background-color: #f2f2f2;}'+
'';
document.body.appendChild(inject_css);

setTimeout(function main() {
    if (window.hasOwnProperty("jsparser")
        && window.jsparser.hasOwnProperty("rules")
        && window.jsparser.hasOwnProperty("update_rules")
        && !window.jsparser.rules.hasOwnProperty("ot"))
    {
        window.jsparser.rules.ot = rule_ot;
        window.jsparser.update_rules();
    } else {
        setTimeout(main, 1000);
    }
}, 1000);

})();
