/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */


        function updateMyInfoTable() {
            $.ajax({ url: "GetClientServlet",
                success : function(text){
                    response = text;
                    if (response == "failure") {
                        $(location).attr("href","index.jsp");
                    } else {
                        var jsonGot = JSON.parse(response);
                        document.getElementById("fieldName").value = jsonGot.name;
                        document.getElementById("fieldSurname").value = jsonGot.surname;
                        document.getElementById("fieldMiddlename").value = jsonGot.middlename;
                        document.getElementById("fieldAddress").value = jsonGot.address;
                        document.getElementById("fieldTelephone").value = jsonGot.telephone;
                        document.getElementById("fieldBirthday").value = jsonGot.birthday;
                        document.getElementById("fieldEmail").value = jsonGot.email;
                        document.getElementById("fieldGender").value = jsonGot.sex;
                    }
                },
                error: function() { $(location).attr("href","index.jsp") }
                });

        }
            function logoutClient() {
                var btn = $("#logoutButton");
                btn.button("loading");
                $.ajax({ url: "LogoutServlet",
                    success : function(text){
                        response = text;
                        if (response == "success") {
                            $(location).attr("href","index.jsp");
                        } else {
                            $("#logoutButton").innerHtml = "Logout failed!"
                        }
                    },
                    error: function() { $("#logoutButton").innerHtml = "Logout failed!" }
                });                            
            }
            function makePaymentsFormElement(jsonGot) {
                $("#contentPlace").load("elementscl.html #paymentsClientAll", function() {makePaymentsFormElementP2(jsonGot);});
            }
            function makePaymentsFormElementP2(jsonGot) {
                var labels = [ "Date of payment", "Sum of payment", "Bank name", "Account number", "Banks mfo", "Payment purpose"];
                var names = [ "paym_date", "paym_sum", "banks_account.bank.name", "banks_account.acc_number", "banks_account.bank.mfo", "paym_purpose"];
                for (j=0; j <jsonGot.length; j++) {
                    jsonGot[j].paym_sum = jsonGot[j].paym_sum/100;
                    var newRow = document.createElement("tr");
                    var cell1 = document.createElement("td");
                    cell1.innerHTML = jsonGot[j].paym_date;
                    var cell2 = document.createElement("td");
                    cell2.innerHTML = jsonGot[j].paym_sum;
                    var cell3 = document.createElement("td");
                    cell3.innerHTML = jsonGot[j].paym_purpose;
                    var cell4 = document.createElement("td");
                    var collapseButton = document.createElement("button");
                    collapseButton.innerHTML = "Show more";
                    collapseButton.setAttribute("type", "button");
                    collapseButton.setAttribute("class", "btn btn-small");
                    collapseButton.setAttribute("data-toggle", "collapse");
                    collapseButton.setAttribute("data-target", "#"+j+"-paymentRow");
                    cell4.appendChild(collapseButton);
                    newRow.appendChild(cell1);
                    newRow.appendChild(cell2);                    
                    newRow.appendChild(cell3);
                    newRow.appendChild(cell4);
                    document.getElementById("paymentsClientAllTBody").appendChild(newRow);
                    var newRowCollapsible = document.createElement("tr");
                    var cellCollapsible = document.createElement("td");                    
                    cellCollapsible.setAttribute("colspan", 4);
                    newRowCollapsible.appendChild(cellCollapsible);
                    document.getElementById("paymentsClientAllTBody").appendChild(newRowCollapsible);
                    var formDiv = document.createElement("div");
                    formDiv.setAttribute("id", j+"-paymentRow");
                    formDiv.setAttribute("class", "collapse");                
                    var tempForm = document.createElement("form");
                    tempForm.setAttribute("class", "form-horizontal")
                    for (i=0; i<names.length; i++) {
                        var divCG = document.createElement("div");
                        divCG.className = "control-group";
                        var labelCL = document.createElement("label");
                        labelCL.className = "control-label";
                        labelCL.setAttribute("for", j + "-fieldName-" + i);
                        labelCL.innerHTML = labels[i];
                        var divCs = document.createElement("div");
                        divCs.className = "controls";
                        var inputText = document.createElement("input");
                        inputText.setAttribute("type", "text")
                        inputText.id =j + "-fieldName-" + i;
                        inputText.setAttribute("value", eval("jsonGot[" + j + "]." + names[i]));
                        inputText.setAttribute("disabled", "true");
                        divCs.appendChild(inputText);
                        divCG.appendChild(labelCL);
                        divCG.appendChild(divCs);
                        tempForm.appendChild(divCG);
                    }
                    formDiv.appendChild(tempForm);
                    cellCollapsible.appendChild(formDiv);

                }
            }
            function makeAgreementsFormElement(jsonGot) {
                $("#contentPlace").load("elementscl.html #agreementsClientAll", function() {makeAgreementsFormElementP2(jsonGot);});
            }
            function makeAgreementsFormElementP2(jsonGot) {
                var labels = [ "Agreement #", "Date of writing", "Date of beginning","Date of payment", "Sum to be paid", "Actually paid", "On"];
                var names = [ "agr_number", "date_written", "date_begin", "date_pay", "sum_pay", "payment.paym_sum", "payment.paym_date"];
                for (j=0; j <jsonGot.length; j++) {
                    var paid = true;
                    if (!("payment" in jsonGot[j])) paid = false;
                    jsonGot[j].sum_pay = jsonGot[j].sum_pay/100;
                    if (paid) jsonGot[j].payment.paym_sum = jsonGot[j].payment.paym_sum/100;
                    var newRow = document.createElement("tr");
                    var cell1 = document.createElement("td");
                    cell1.innerHTML = jsonGot[j].agr_number;
                    var cell2 = document.createElement("td");
                    cell2.innerHTML = jsonGot[j].date_written;
                    var cell3 = document.createElement("td");
                    cell3.innerHTML = jsonGot[j].sum_pay;
                    var cell4 = document.createElement("td");
                    if (paid) cell4.innerHTML = jsonGot[j].payment.paym_date;
                    else cell4.innerHTML = "Not paid";
                    var cell5 = document.createElement("td");
                    var collapseButton = document.createElement("button");
                    collapseButton.innerHTML = "Show more";
                    collapseButton.setAttribute("type", "button");
                    collapseButton.setAttribute("class", "btn btn-small");
                    collapseButton.setAttribute("data-toggle", "collapse");
                    collapseButton.setAttribute("data-target", "#"+j+"-agreementRow");
                    cell5.appendChild(collapseButton);
                    newRow.appendChild(cell1);
                    newRow.appendChild(cell2);                    
                    newRow.appendChild(cell3);
                    newRow.appendChild(cell4);
                    newRow.appendChild(cell5);
                    document.getElementById("agreementsClientAllTBody").appendChild(newRow);
                    var newRowCollapsible = document.createElement("tr");
                    var cellCollapsible = document.createElement("td");                    
                    cellCollapsible.setAttribute("colspan", 5);
                    newRowCollapsible.appendChild(cellCollapsible);
                    document.getElementById("agreementsClientAllTBody").appendChild(newRowCollapsible);
                    var formDiv = document.createElement("div");
                    formDiv.setAttribute("id", j+"-agreementRow");
                    formDiv.setAttribute("class", "collapse");                
                    var tempForm = document.createElement("form");
                    tempForm.setAttribute("class", "form-horizontal")
                    for (i=0; i<names.length; i++) {
                        var divCG = document.createElement("div");
                        divCG.className = "control-group";
                        var labelCL = document.createElement("label");
                        labelCL.className = "control-label";
                        labelCL.setAttribute("for", j + "-fieldName-" + i);
                        labelCL.innerHTML = labels[i];
                        var divCs = document.createElement("div");
                        divCs.className = "controls";
                        var inputText = document.createElement("input");
                        inputText.setAttribute("type", "text")
                        inputText.id =j + "-fieldName-" + i;
                        if (i < 5) inputText.setAttribute("value", eval("jsonGot[" + j + "]." + names[i]));
                        if (i > 4) {
                            if (paid) inputText.setAttribute("value", eval("jsonGot[" + j + "]." + names[i]));
                            else inputText.setAttribute("value", "Not paid");
                        }
                        inputText.setAttribute("disabled", "true");
                        divCs.appendChild(inputText);
                        divCG.appendChild(labelCL);
                        divCG.appendChild(divCs);
                        tempForm.appendChild(divCG);
                    }
                    formDiv.appendChild(tempForm);
                    cellCollapsible.appendChild(formDiv);

                }
            }