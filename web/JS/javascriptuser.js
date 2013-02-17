/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
            function logoutUser() {
                var btn = $("#logoutButton");
                $.ajax({ url: "LogoutServlet",
                    success : function(text){
                        response = text;
                        if (response == "success") {
                            $(location).attr("href","index.jsp");
                        } else {
                            $("#logoutButton").innerHtml = "Failed!"
                        }
                    },
                    error: function() { $("#logoutButton").innerHtml = "Failed!" }
                });                            
            }
            function updateMyInfoTable() {
                $.ajax({ url: "GetUserServlet",
                    success : function(text){
                        response = text;
                        if (response == "failure") {
                            $(location).attr("href","index.jsp");
                        } else {
                            var jsonGot = JSON.parse(response);
                            document.getElementById("fieldName").value = jsonGot[0].name;
                            document.getElementById("fieldSurname").value = jsonGot[0].surname;
                            document.getElementById("fieldMiddlename").value = jsonGot[0].middlename;
                            document.getElementById("fieldDepartment").value = jsonGot[0].department;
                            document.getElementById("fieldPosition").value = jsonGot[0].position;
                            document.getElementById("fieldAddress").value = jsonGot[0].address;
                            document.getElementById("fieldBirthday").value = jsonGot[0].birthday;
                            document.getElementById("fieldEmail").value = jsonGot[0].email;
                            document.getElementById("fieldGender").value = jsonGot[0].sex;
                        }
                    },
                    error: function() { $(location).attr("href","index.jsp") }
                    });

            }
            function makeClientsFormElement(jsonGot) {
                $("#contentPlace").load("elementsus.html #clientsUserAll", function() {makeClientsFormElementP2(jsonGot);});
            }
            function makeClientsFormElementP2(jsonGotP2) {
                for (j=0; j <jsonGotP2.length; j++) {
                    var newRow = document.createElement("tr");
                    newRow.setAttribute("id", "rowNumber" + j);
                    newRow.setAttribute("onclick", "makeRowSelected(\"rowNumber" + j + "\")");
                    newRow.setAttribute("data-clientid", jsonGotP2[j].client_id);
                    var cell1 = document.createElement("td");
                    cell1.innerHTML = jsonGotP2[j].name+" "+jsonGotP2[j].middlename+" "+jsonGotP2[j].surname;
                    var cell2 = document.createElement("td");
                    cell2.innerHTML = jsonGotP2[j].address;
                    var cell3 = document.createElement("td");
                    cell3.innerHTML = jsonGotP2[j].telephone;
                    var cell4 = document.createElement("td");
                    cell4.innerHTML = jsonGotP2[j].email;
                    var cell5 = document.createElement("td");
                    cell5.innerHTML = jsonGotP2[j].login;
                    var cell6 = document.createElement("td");
                    cell6.innerHTML = jsonGotP2[j].birthday;
                    newRow.appendChild(cell1);
                    newRow.appendChild(cell2);                    
                    newRow.appendChild(cell3);
                    newRow.appendChild(cell4);
                    newRow.appendChild(cell5);
                    newRow.appendChild(cell6);                    
                    document.getElementById("clientsUserAllTBody").appendChild(newRow);
                }
            }
            function searchClientFormOut(jsonGotClientsSearch) {
                var searchClientName = document.getElementById("searchClientByName").value.toLowerCase();
                var searchClientAddress = document.getElementById("searchClientByAddress").value.toLowerCase();
                var searchClientTelephone = document.getElementById("searchClientByTelephone").value.toLowerCase();
                var searchClientEmail = document.getElementById("searchClientByEmail").value.toLowerCase();
                var searchClientLogin = document.getElementById("searchClientByLogin").value.toLowerCase();
                for (i = 0; i < jsonGotClientsSearch.length; i++) {
                    var keepRow = 1;
                    var jsonFullName = jsonGotClientsSearch[i].name + " " + jsonGotClientsSearch[i].surname + " " + jsonGotClientsSearch[i].middlename;
                    keepRow *= (jsonFullName.toLowerCase().indexOf(searchClientName) + 1);
                    keepRow *= (jsonGotClientsSearch[i].address.toLowerCase().indexOf(searchClientAddress) + 1);
                    keepRow *= (jsonGotClientsSearch[i].telephone.toLowerCase().indexOf(searchClientTelephone) + 1);
                    keepRow *= (jsonGotClientsSearch[i].email.toLowerCase().indexOf(searchClientEmail) + 1);
                    keepRow *= (jsonGotClientsSearch[i].login.toLowerCase().indexOf(searchClientLogin) + 1);
                    if (keepRow == 0) {
                        jsonGotClientsSearch.splice(i, 1);
                        i -= 1;
                    }
                }
                document.getElementById("clientsUserAllTBody").innerHTML = "";
                makeClientsFormElementP2(jsonGotClientsSearch);
            }
            function makeRowSelected(rowid) {
                var prevSelRow = $("#clientsUserAllTBody").attr("class");
                if (prevSelRow != null) document.getElementById(prevSelRow).removeAttribute("class");
                if (prevSelRow == null) {
                    $("#expandClientButton").html("Expand client");
                    $("#expandClientButton").removeAttr("disabled");
                }
                document.getElementById("clientsUserAllTBody").setAttribute("class", rowid);
                document.getElementById(rowid).setAttribute("class", "info");
            }
            function searchClientReset() {
                document.getElementById("searchClientByName").value = "";
                document.getElementById("searchClientByAddress").value = "";
                document.getElementById("searchClientByTelephone").value = "";
                document.getElementById("searchClientByEmail").value = "";
                document.getElementById("searchClientByLogin").value = "";
                searchClientKeyPressed();
            }
            function expandClientButtonPressed(){
                $("#expandClientButton").html("Wait...");
                if ($("#expandClientButton").attr("disabled") == "disabled") return false;
                $("#expandClientButton").attr("disabled","disabled");
                var client_id = document.getElementById(document.getElementById("clientsUserAllTBody").getAttribute("class")).getAttribute(("data-clientid"));
                $.ajax({
                    url: "GetUserExpandClientServlet",
                    data: {"param1" : client_id},
                    error: function() {
                        $("#expandClientButton").html("FAILED");
                        $("#expandClientButton").removeAttr("disabled");
                    },
                    success: function(text) {
                        response = text;
                        if (response == "failure") {
                            $(location).attr("href","index.jsp");
                        } else {
                            var jsonExpandClient = JSON.parse(response);
                            $("#contentPlace").load("elementsus.html #expandClientAll", function() {makeExpandFormElement(jsonExpandClient);});
                        }
                    }
                });
            }
            
            function makeExpandFormElement(jsonGot) {
                $("#contentPlace").load("elementsus.html #expandClientAll", function() {
                    makeExpandClientFormElementP2(jsonGot);
                    makeExpandAgreementsFormElementP2(jsonGot);
                    makeExpandPaymentsFormElementP2(jsonGot);                
                });
            }
            function makeExpandClientFormElementP2(jsonGotP2) {
                $("#expandClientHeader").html("Client: <em>" + jsonGotP2.client.surname + " " + jsonGotP2.client.name + " " + jsonGotP2.client.middlename + "</em");
                $("#expandClientInfoAddress").html(jsonGotP2.client.address);
                $("#expandClientInfoTelephone").html(jsonGotP2.client.telephone);
                $("#expandClientInfoBirthday").html(jsonGotP2.client.birthday);
                $("#expandClientInfoEmail").html(jsonGotP2.client.email);
                $("#expandClientInfoLogin").html(jsonGotP2.client.login);
            }
            function makeExpandAgreementsFormElementP2(jsonGotP2) {
                for (j=0; j <jsonGotP2.agreements.length; j++) {
                    var newRow = document.createElement("tr");
                    newRow.setAttribute("id", "rowAgrNumber" + j);
                    var cell1 = document.createElement("td");
                    cell1.innerHTML = jsonGotP2.agreements[j].agr_number;
                    var cell2 = document.createElement("td");
                    cell2.innerHTML = jsonGotP2.agreements[j].date_written;
                    var cell3 = document.createElement("td");
                    cell3.innerHTML = jsonGotP2.agreements[j].date_begin;
                    var cell4 = document.createElement("td");
                    cell4.innerHTML = jsonGotP2.agreements[j].date_end;
                    var cell5 = document.createElement("td");
                    cell5.innerHTML = jsonGotP2.agreements[j].date_pay;
                    var cell6 = document.createElement("td");
                    cell6.innerHTML = jsonGotP2.agreements[j].sum_pay/100;
                    var paid = true;
                    if (!("payment" in jsonGotP2.agreements[j])) paid = false;
                    var cell7 = document.createElement("td");
                    var cell8 = document.createElement("td");
                    if (paid) {
                        cell7.innerHTML = jsonGotP2.agreements[j].payment.paym_sum/100;
                        cell8.innerHTML = jsonGotP2.agreements[j].payment.paym_date;
                    } else {
                        cell7.innerHTML = "Not paid";
                        cell8.innerHTML = "Not paid";
                        newRow.setAttribute("class", "error");
                    }
                    newRow.appendChild(cell1);
                    newRow.appendChild(cell2);                    
                    newRow.appendChild(cell3);
                    newRow.appendChild(cell4);
                    newRow.appendChild(cell5);
                    newRow.appendChild(cell6);                  
                    newRow.appendChild(cell7);
                    newRow.appendChild(cell8);                    
                    document.getElementById("expandClientAgreementsTBody").appendChild(newRow);
                }
            }

            function makeExpandPaymentsFormElementP2(jsonGotP2) {
                for (j=0; j <jsonGotP2.agreements.length; j++) {
                    if ("payment" in jsonGotP2.agreements[j]) {
                        var newRow = document.createElement("tr");
                        newRow.setAttribute("id", "rowPayAgrNumber" + j);
                        var cell1 = document.createElement("td");
                        cell1.innerHTML = jsonGotP2.agreements[j].payment.paym_date;
                        var cell2 = document.createElement("td");
                        cell2.innerHTML = jsonGotP2.agreements[j].payment.paym_sum/100;
                        var cell3 = document.createElement("td");
                        cell3.innerHTML = jsonGotP2.agreements[j].agr_number;
                        var cell4 = document.createElement("td");
                        cell4.innerHTML = jsonGotP2.agreements[j].payment.banks_account.bank.name;
                        var cell5 = document.createElement("td");
                        cell5.innerHTML = jsonGotP2.agreements[j].payment.banks_account.acc_number;
                        var cell6 = document.createElement("td");
                        cell6.innerHTML = jsonGotP2.agreements[j].payment.banks_account.bank.mfo;
                        var cell7 = document.createElement("td");
                        cell7.innerHTML = jsonGotP2.agreements[j].payment.paym_purpose;
                        newRow.appendChild(cell1);
                        newRow.appendChild(cell2);                    
                        newRow.appendChild(cell3);
                        newRow.appendChild(cell4);
                        newRow.appendChild(cell5);
                        newRow.appendChild(cell6);                  
                        newRow.appendChild(cell7);
                        document.getElementById("expandClientPaymentsTBody").appendChild(newRow);                        
                    }
                    
                }
                for (j=0; j <jsonGotP2.payments.length; j++) {
                if (jsonGotP2.payments[j].paym_state == 2) {
                        var newRow = document.createElement("tr");
                        newRow.setAttribute("id", "rowPayPayNumber" + j);
                        newRow.setAttribute("class", "error");
                        var cell1 = document.createElement("td");
                        cell1.innerHTML = jsonGotP2.payments[j].paym_date;
                        var cell2 = document.createElement("td");
                        cell2.innerHTML = jsonGotP2.payments[j].paym_sum/100;
                        var cell3 = document.createElement("td");
                        cell3.innerHTML = "No agreement!";
                        var cell4 = document.createElement("td");
                        cell4.innerHTML = jsonGotP2.payments[j].banks_account.bank.name;
                        var cell5 = document.createElement("td");
                        cell5.innerHTML = jsonGotP2.payments[j].banks_account.acc_number;
                        var cell6 = document.createElement("td");
                        cell6.innerHTML = jsonGotP2.payments[j].banks_account.bank.mfo;
                        var cell7 = document.createElement("td");
                        cell7.innerHTML = jsonGotP2.payments[j].paym_purpose;
                        newRow.appendChild(cell1);
                        newRow.appendChild(cell2);                    
                        newRow.appendChild(cell3);
                        newRow.appendChild(cell4);
                        newRow.appendChild(cell5);
                        newRow.appendChild(cell6);                  
                        newRow.appendChild(cell7);
                        document.getElementById("expandClientPaymentsTBody").appendChild(newRow);                        
                    }
                    
                }
            }
            function validateAddClientInput(param1, param2, param3, param4) {
                var passing = {}
                passing[param4]= $("#" + param3).val();
                $.ajax({
                    url: "ValidateServlet",
                    data: passing,
                    error: function() {
                        $("#" + param1).addClass("error");
                        $("#" + param1).removeClass("success");
                        $("#" + param2).html("Wrong input!");
                    },
                    success: function(text) {
                        response = text;
                        if (response == "success") {
                            $("#" + param1).addClass("success");
                            $("#" + param1).removeClass("error");
                            $("#" + param2).html("Ok!");
                        } else {
                            $("#" + param1).addClass("error");
                            $("#" + param1).removeClass("success");
                            $("#" + param2).html("Wrong input!");
                        }
                    }
                });
            }
            function validateAddClientLogin(param1, param2, param3, param4) {
                var passing = {}
                passing[param4]= $("#" + param3).val();
                passing["param1"]= $("#" + param3).val();                
                $.ajax({
                    url: "CheckClientLoginServlet",
                    data: passing,
                    error: function() {
                        $("#" + param1).addClass("error");
                        $("#" + param1).removeClass("success");
                        $("#" + param2).html("Wrong or occupied login!");
                    },
                    success: function(text) {
                        response = text;
                        if (response == "success") {
                            $("#" + param1).addClass("success");
                            $("#" + param1).removeClass("error");
                            $("#" + param2).html("Ok!");
                        } else {
                            $("#" + param1).addClass("error");
                            $("#" + param1).removeClass("success");
                            $("#" + param2).html("Wrong or occupied login!");
                        }
                    }
                });
            }
            function validateAddClientPassword() {
                if ($("#addClientFieldPassword2").val() == $("#addClientFieldPassword").val()) {
                    $("#addClientCGPassword2").addClass("success");
                    $("#addClientCGPassword2").removeClass("error");
                    $("#addClientLabelPassword2").html("Ok!");
                    $("#addClientCGPassword").addClass("success");
                    $("#addClientCGPassword").removeClass("error");
                    $("#addClientLabelPassword").html("Ok!");
                    validateAddClientInput('addClientCGPassword', 'addClientLabelPassword', 'addClientFieldPassword', 'clientsPassword');
                    validateAddClientInput('addClientCGPassword2', 'addClientLabelPassword2', 'addClientFieldPassword2', 'clientsPassword');
                } else {
                    $("#addClientCGPassword2").addClass("error");
                    $("#addClientCGPassword2").removeClass("success");
                    $("#addClientLabelPassword2").html("Dont match!");
                    $("#addClientCGPassword").addClass("error");
                    $("#addClientCGPassword").removeClass("success");
                    $("#addClientLabelPassword").html("Dont match!");                    
                }
            }
            function addClientCheckOk() {
                if ($("#addClientSubmitBtn").attr("disabled") == "disabled") return false;
                var inputFieldsOk = true;
                if (inputFieldsOk) inputFieldsOk = ($("#addClientLabelSurname").html() == "Ok!");
                if (inputFieldsOk) inputFieldsOk = ($("#addClientLabelName").html() == "Ok!");
                if (inputFieldsOk) inputFieldsOk = ($("#addClientLabelMiddlename").html() == "Ok!");
                if (inputFieldsOk) inputFieldsOk = ($("#addClientLabelBirthday").html() == "Ok!");
                if (inputFieldsOk) inputFieldsOk = ($("#addClientLabelAddress").html() == "Ok!");
                if (inputFieldsOk) inputFieldsOk = ($("#addClientLabelTelephone").html() == "Ok!");
                if (inputFieldsOk) inputFieldsOk = ($("#addClientLabelEmail").html() == "Ok!");
                if (inputFieldsOk) inputFieldsOk = ($("#addClientLabelSex").html() == "Ok!");
                if (inputFieldsOk) inputFieldsOk = ($("#addClientLabelLogin").html() == "Ok!");
                if (inputFieldsOk) inputFieldsOk = ($("#addClientLabelPassword").html() == "Ok!");
                if (inputFieldsOk) inputFieldsOk = ($("#addClientLabelPassword2").html() == "Ok!");
                if (!inputFieldsOk) {
                    $("#addClientLabelSubmitBtn").html("<span class=\"text-error\">Check input fields!</span>");
                    $("#addClientSubmitBtn").addClass("btn-danger");
                } else {
                    $("#addClientLabelSubmitBtn").html("<span class=\"text-success\">Wait.. Registering..</span>");
                    $("#addClientSubmitBtn").attr("disabled", "disabled");
                    $("#addClientSubmitBtn").addClass("btn-warning");
                    registerClient();
                }
            }
            function registerClient() {
                var passing = {}
                passing["clientsName"] = $("#addClientFieldName").val();
                passing["clientsMiddlename"] = $("#addClientFieldMiddlename").val();
                passing["clientsSurname"] = $("#addClientFieldSurname").val();
                passing["clientsBirthday"] = $("#addClientFieldBirthday").val();
                passing["clientsAddress"] = $("#addClientFieldAddress").val();
                passing["clientsTelephone"] = $("#addClientFieldTelephone").val();
                passing["clientsEmail"] = $("#addClientFieldEmail").val();                
                passing["clientsSex"] = $("#addClientFieldSex").val();
                passing["clientsLogin"] = $("#addClientFieldLogin").val();
                passing["clientsPassword"] = $("#addClientFieldPassword").val();
                $.ajax({
                    url: "RegisterClientServlet",
                    data: passing,
                    error: function() {
                        $("#addClientLabelSubmitBtn").html("<span class=\"text-error\">Failed! Wrong data!</span>");
                        $("#addClientSubmitBtn").removeClass("btn-warning");
                        $("#addClientSubmitBtn").addClass("btn-danger");
                        $("#addClientSubmitBtn").removeAttr("disabled");
                    },
                    success: function(text) {
                        response = text;
                        if (response == "success") {
                            $("#addClientSubmitBtn").removeClass("btn-warning");
                            $("#addClientLabelSubmitBtn").html("<span class=\"text-success\">Successfull!</span>");
                            $("#addClientSubmitBtn").addClass("btn-success");
                        } else {
                            $("#addClientLabelSubmitBtn").html("<span class=\"text-error\">Failed! Wrong data!</span>");
                            $("#addClientSubmitBtn").removeClass("btn-warning");
                            $("#addClientSubmitBtn").addClass("btn-danger");
                            $("#addClientSubmitBtn").removeAttr("disabled");
                        }
                    }
                }); 
            }
            function makeRemoveClientsFormElement(jsonGot) {
                $("#contentPlace").load("elementsus.html #clientsUserAll", function(response) {
                    $("#contentPlace").append($("<div></div>").load("elementsus.html #removeClientModal", function(response) { makeRemoveClientsFormElementP2(jsonGot);}));
                });
            }
            function makeRemoveClientsFormElementP2(jsonGotP2) {
                for (j=0; j <jsonGotP2.length; j++) {
                    var newRow = document.createElement("tr");
                    newRow.setAttribute("id", "rowNumber" + j);
                    newRow.setAttribute("onclick", "makeRemoveRowSelected(\"rowNumber" + j + "\")");
                    newRow.setAttribute("data-clientid", jsonGotP2[j].client_id);
                    var cell1 = document.createElement("td");
                    cell1.innerHTML = jsonGotP2[j].name+" "+jsonGotP2[j].middlename+" "+jsonGotP2[j].surname;
                    var cell2 = document.createElement("td");
                    cell2.innerHTML = jsonGotP2[j].address;
                    var cell3 = document.createElement("td");
                    cell3.innerHTML = jsonGotP2[j].telephone;
                    var cell4 = document.createElement("td");
                    cell4.innerHTML = jsonGotP2[j].email;
                    var cell5 = document.createElement("td");
                    cell5.innerHTML = jsonGotP2[j].login;
                    var cell6 = document.createElement("td");
                    cell6.innerHTML = jsonGotP2[j].birthday;
                    newRow.appendChild(cell1);
                    newRow.appendChild(cell2);                    
                    newRow.appendChild(cell3);
                    newRow.appendChild(cell4);
                    newRow.appendChild(cell5);
                    newRow.appendChild(cell6);                    
                    document.getElementById("clientsUserAllTBody").appendChild(newRow);
                }
            }
            function searchRemoveClientFormOut(jsonGotClientsSearch) {
                var searchClientName = document.getElementById("searchClientByName").value.toLowerCase();
                var searchClientAddress = document.getElementById("searchClientByAddress").value.toLowerCase();
                var searchClientTelephone = document.getElementById("searchClientByTelephone").value.toLowerCase();
                var searchClientEmail = document.getElementById("searchClientByEmail").value.toLowerCase();
                var searchClientLogin = document.getElementById("searchClientByLogin").value.toLowerCase();
                for (i = 0; i < jsonGotClientsSearch.length; i++) {
                    var keepRow = 1;
                    var jsonFullName = jsonGotClientsSearch[i].name + " " + jsonGotClientsSearch[i].surname + " " + jsonGotClientsSearch[i].middlename;
                    keepRow *= (jsonFullName.toLowerCase().indexOf(searchClientName) + 1);
                    keepRow *= (jsonGotClientsSearch[i].address.toLowerCase().indexOf(searchClientAddress) + 1);
                    keepRow *= (jsonGotClientsSearch[i].telephone.toLowerCase().indexOf(searchClientTelephone) + 1);
                    keepRow *= (jsonGotClientsSearch[i].email.toLowerCase().indexOf(searchClientEmail) + 1);
                    keepRow *= (jsonGotClientsSearch[i].login.toLowerCase().indexOf(searchClientLogin) + 1);
                    if (keepRow == 0) {
                        jsonGotClientsSearch.splice(i, 1);
                        i -= 1;
                    }
                }
                document.getElementById("clientsUserAllTBody").innerHTML = "";
                makeRemoveClientsFormElementP2(jsonGotClientsSearch);
            }
            function makeRemoveRowSelected(rowid) {
                var prevSelRow = $("#clientsUserAllTBody").attr("class");
                if (prevSelRow != null) document.getElementById(prevSelRow).removeAttribute("class");
                if (prevSelRow == null) {
                    $("#expandClientButton").html("Remove client");
                    $("#expandClientButton").attr("onclick", "removeClientButtonPressed()");
                    $("#expandClientButton").removeAttr("disabled");
                }
                document.getElementById("clientsUserAllTBody").setAttribute("class", rowid);
                document.getElementById(rowid).setAttribute("class", "info");
            }            
            function removeClientButtonPressed(){
                $("#expandClientButton").html("Wait...");
                $("#expandClientButton").attr("disabled","disabled");
                $('#removeClientApprModal').modal();
            }
            function abortRemoveClientModal() {
                $("#expandClientButton").html("Remove client");
                $("#expandClientButton").removeAttr("disabled");                
            }
            function removeClient() {
                $('#removeClientApprModal').modal("hide");
                var client_id = document.getElementById(document.getElementById("clientsUserAllTBody").getAttribute("class")).getAttribute(("data-clientid"));
                $.ajax({
                    url: "RemoveClientServlet",
                    data: {"param1" : client_id},
                    error: function() {
                        $("#expandClientButton").html("FAILED");
                        $("#expandClientButton").removeAttr("disabled");
                        alert("Failed!");
                    },
                    success: function(text) {
                        response = text;
                        if (response == "failure") {
                            $("#expandClientButton").html("FAILED");
                            $("#expandClientButton").removeAttr("disabled");
                            alert("Fail!");
                        } else {
                            alert("Successfull!");
                            leftRemoveClientsMenuPressed();
                        }
                    }
                });
            }
            function makeAgreementsFormElement(jsonGot) {
                $("#contentPlace").load("elementsus.html #agreementsUserAll", function() {makeAgreementsFormElementP2(jsonGot);});
            }
            function makeAgreementsFormElementP2(jsonGotP2) {
                for (j=0; j <jsonGotP2.length; j++) {
                    var newRow = document.createElement("tr");
                    newRow.setAttribute("id", "rowNumber" + j);
                    newRow.setAttribute("onclick", "makeAgrRowSelected(\"rowNumber" + j + "\")");
                    newRow.setAttribute("data-clientid", jsonGotP2[j].agr_id);
                    var cell1 = document.createElement("td");
                    cell1.innerHTML = jsonGotP2[j].agr_number;
                    var cell2 = document.createElement("td");
                    cell2.innerHTML = jsonGotP2[j].client.surname+" "+jsonGotP2[j].client.name+" "+jsonGotP2[j].client.middlename;
                    var cell3 = document.createElement("td");
                    cell3.innerHTML = jsonGotP2[j].date_written;
                    var cell4 = document.createElement("td");
                    cell4.innerHTML = jsonGotP2[j].sum_pay/100;
                    var cell5 = document.createElement("td");
                    cell5.innerHTML = jsonGotP2[j].date_pay;
                    var paid = true;
                    if (!("payment" in jsonGotP2[j])) paid = false;
                    var cell6 = document.createElement("td");
                    var cell7 = document.createElement("td");
                    if (paid) {
                        cell6.innerHTML = jsonGotP2[j].payment.paym_date;
                        cell7.innerHTML = jsonGotP2[j].payment.paym_sum/100;
                    } else {
                        cell6.setAttribute("colspan", 2);
                        cell6.innerHTML = "Not paid";
                        newRow.setAttribute("class", "error");
                    }
                    newRow.appendChild(cell1);
                    newRow.appendChild(cell2);                    
                    newRow.appendChild(cell3);
                    newRow.appendChild(cell4);
                    newRow.appendChild(cell5);
                    newRow.appendChild(cell6);                    
                    newRow.appendChild(cell7);                    
                    document.getElementById("agreementsUserAllTBody").appendChild(newRow);
                }
            }
            function makeAgrRowSelected(rowid) {
                var prevSelRow = $("#agreementsUserAllTBody").attr("class");
                if (prevSelRow != null) $("#"+prevSelRow).removeClass("info");
                if (prevSelRow == null) {
                    $("#expandClientButton").removeAttr("disabled");
                }
                document.getElementById("agreementsUserAllTBody").setAttribute("class", rowid);
                $("#"+rowid).addClass("info");
            }
            function searchAgreementFormOut(jsonGotAgreementsSearch) {
                var searchAgreementNumber = document.getElementById("searchAgreementByNumber").value;
                var searchAgreementName = document.getElementById("searchAgreementByName").value.toLowerCase();
                var searchAgreementSum = parseInt(document.getElementById("searchAgreementBySum").value)*100;
                var searchAgreementPaid = document.getElementById("searchAgreementByPaid").value;
                for (i = 0; i < jsonGotAgreementsSearch.length; i++) {
                    var keepRow = 1;
                    var jsonFullName = jsonGotAgreementsSearch[i].client.name + " " + jsonGotAgreementsSearch[i].client.surname + " " + jsonGotAgreementsSearch[i].client.middlename;
                    keepRow *= (jsonGotAgreementsSearch[i].agr_number.indexOf(searchAgreementNumber) + 1);
                    keepRow *= (jsonFullName.toLowerCase().indexOf(searchAgreementName) + 1);
                    keepRow *= (jsonGotAgreementsSearch[i].sum_pay.toString().indexOf((searchAgreementSum.toString()=="NaN") ? "" : searchAgreementSum.toString())+1);
                    if ((searchAgreementPaid.indexOf("paid") > 0)){
                        keepRow *= ("payment" in jsonGotAgreementsSearch[i]) ? 0:1;
                    }
                    if ((searchAgreementPaid.indexOf("paid") == 0)){
                        keepRow *= ("payment" in jsonGotAgreementsSearch[i]) ? 1:0;
                    } 
                    if ((searchAgreementPaid.indexOf("paid") < 0))  keepRow *= 1;
                    if (keepRow == 0) {
                        jsonGotAgreementsSearch.splice(i, 1);
                        i -= 1;
                    }
                }
                document.getElementById("agreementsUserAllTBody").innerHTML = "";
                makeAgreementsFormElementP2(jsonGotAgreementsSearch);
            }
            function searchAgreementsReset() {
                document.getElementById("searchAgreementByNumber").value = "";
                document.getElementById("searchAgreementByName").value = "";
                document.getElementById("searchAgreementBySum").value = "";
                document.getElementById("searchAgreementByPaid").value = "any";
                searchAgreementKeyPressed();
            }
            function validateAddAgreementInput(param1, param2, param3, param4) {
                var passing = {}
                passing[param4]= $("#" + param3).val();
                $.ajax({
                    url: "ValidateServlet",
                    data: passing,
                    error: function() {
                        $("#" + param1).addClass("error");
                        $("#" + param1).removeClass("success");
                        $("#" + param2).html("Wrong input!");
                    },
                    success: function(text) {
                        response = text;
                        if (response == "success") {
                            $("#" + param1).addClass("success");
                            $("#" + param1).removeClass("error");
                            $("#" + param2).html("Ok!");
                        } else {
                            $("#" + param1).addClass("error");
                            $("#" + param1).removeClass("success");
                            $("#" + param2).html("Wrong input!");
                        }
                    }
                });
            }
            function validateAddAgreementSum(param1, param2, param3, param4) {
                var passing = {}
                sum = parseFloat($("#" + param3).val().replace(/[,]+/g, '.'))*100;
                passing[param4]= sum;
                $.ajax({
                    url: "ValidateServlet",
                    data: passing,
                    error: function() {
                        $("#" + param1).addClass("error");
                        $("#" + param1).removeClass("success");
                        $("#" + param2).html("Wrong input!");
                    },
                    success: function(text) {
                        response = text;
                        if (response == "success") {
                            $("#" + param1).addClass("success");
                            $("#" + param3).val(sum/100);
                            $("#" + param1).removeClass("error");
                            $("#" + param2).html("Ok!");
                        } else {
                            $("#" + param1).addClass("error");
                            $("#" + param1).removeClass("success");
                            $("#" + param2).html("Wrong input!");
                        }
                    }
                });
            }
            function validateAddAgreementNumber(param1, param2, param3, param4) {
                var passing = {}
                passing[param4]= $("#" + param3).val();
                passing["param1"]= $("#" + param3).val();                
                $.ajax({
                    url: "CheckAgreementNumberServlet",
                    data: passing,
                    error: function() {
                        $("#" + param1).addClass("error");
                        $("#" + param1).removeClass("success");
                        $("#" + param2).html("Wrong or occupied number!");
                    },
                    success: function(text) {
                        response = text;
                        if (response == "success") {
                            $("#" + param1).addClass("success");
                            $("#" + param1).removeClass("error");
                            $("#" + param2).html("Ok!");
                        } else {
                            $("#" + param1).addClass("error");
                            $("#" + param1).removeClass("success");
                            $("#" + param2).html("Wrong or occupied login!");
                        }
                    }
                });
            }
            function addAgreementCheckOk() {
                if ($("#addAgreementSubmitBtn").attr("disabled") == "disabled") return false;
                var inputFieldsOk = true;
                if (inputFieldsOk) inputFieldsOk = ($("#addAgreementLabelClient").html() == "Ok!");                
                if (inputFieldsOk) inputFieldsOk = ($("#addAgreementLabelAgr_number").html() == "Ok!");
                if (inputFieldsOk) inputFieldsOk = ($("#addAgreementLabelDate_written").html() == "Ok!");
                if (inputFieldsOk) inputFieldsOk = ($("#addAgreementLabelDate_begin").html() == "Ok!");
                if (inputFieldsOk) inputFieldsOk = ($("#addAgreementLabelDate_end").html() == "Ok!");
                if (inputFieldsOk) inputFieldsOk = ($("#addAgreementLabelDate_pay").html() == "Ok!");
                if (inputFieldsOk) inputFieldsOk = ($("#addAgreementLabelSum_pay").html() == "Ok!");
                if (!inputFieldsOk) {
                    $("#addAgreementLabelSubmitBtn").html("<span class=\"text-error\">Check input fields!</span>");
                    $("#addAgreementSubmitBtn").addClass("btn-danger");
                } else {
                    $("#addAgreementLabelSubmitBtn").html("<span class=\"text-success\">Wait.. Registering..</span>");
                    $("#addAgreementSubmitBtn").attr("disabled", "disabled");
                    $("#addAgreementSubmitBtn").addClass("btn-success");
                    registerAgreement();
                }
            }
            function registerAgreement() {
                var passing = {}
                passing["agreementsClient"] = $("#addAgreementFieldClient").attr("class");
                passing["agreementsAgr_number"] = $("#addAgreementFieldAgr_number").val();
                passing["agreementsDate_written"] = $("#addAgreementFieldDate_written").val();
                passing["agreementsDate_begin"] = $("#addAgreementFieldDate_begin").val();
                passing["agreementsDate_end"] = $("#addAgreementFieldDate_end").val();
                passing["agreementsDate_pay"] = $("#addAgreementFieldDate_pay").val();
                passing["agreementsSum_pay"] = parseFloat($("#addAgreementFieldSum_pay").val())*100;
                $.ajax({
                    url: "RegisterAgreementServlet",
                    data: passing,
                    error: function() {
                        $("#addAgreementLabelSubmitBtn").html("<span class=\"text-error\">Failed! Wrong data!</span>");
                        $("#addAgreementSubmitBtn").addClass("btn-danger");
                        $("#addAgreementSubmitBtn").removeAttr("disabled");
                    },
                    success: function(text) {
                        response = text;
                        if (response == "success") {
                            $("#addAgreementLabelSubmitBtn").html("<span class=\"text-success\">Successfull!</span>");
                            $("#addAgreementSubmitBtn").addClass("btn-success");
                        } else {
                            $("#addAgreementLabelSubmitBtn").html("<span class=\"text-error\">Failed! Wrong data!</span>");
                            $("#addAgreementSubmitBtn").addClass("btn-danger");
                            $("#addAgreementSubmitBtn").removeAttr("disabled");
                        }
                    }
                }); 
            }
            var jsonGotClientsModal;
            function chooseClientModalStart() {
                $.ajax( {
                    url: "GetUserClientsServlet",
                    error: function() {$("#chooseClientModalWait").html("Failed. Try again") },
                    success: function(text) {
                        var response = text;
                        if (response == "failure") $("#chooseClientModalWait").html("Failed. Try again");
                        if (response == "nodata") $("#chooseClientModalWait").html("<div class=\"alert\"><h3><strong>Sorry!</strong></h3>    <h5>You don't have any clients.</h5></div>​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​");
                        if (response != "failure" && response != "nodata") {
                        jsonGotClientsModal = JSON.parse(response);
                        $("#chooseClientModalWait").html("");
                        fillClientModalTable(jsonGotClientsModal);
                        }
                   }
                });
            }
            function fillClientModalTable(jsonGotClientsModal){
                document.getElementById("chooseClientModalTBody").innerHTML = "";                
                for (j=0; j <jsonGotClientsModal.length; j++) {
                    var newRow = document.createElement("tr");
                    newRow.setAttribute("id", "rowNumber" + j);
                    newRow.setAttribute("onclick", "makeModalRowSelected(\"rowNumber" + j + "\")");
                    newRow.setAttribute("data-clientid", jsonGotClientsModal[j].client_id);
                    var cell1 = document.createElement("td");
                    cell1.innerHTML = jsonGotClientsModal[j].surname + " " + jsonGotClientsModal[j].name + " " + jsonGotClientsModal[j].middlename;
                    var cell2 = document.createElement("td");
                    cell2.innerHTML = jsonGotClientsModal[j].birthday;
                    newRow.appendChild(cell1);
                    newRow.appendChild(cell2);                    
                    document.getElementById("chooseClientModalTBody").appendChild(newRow);
                }                
            }
            function makeModalRowSelected(rowId) {
                var prevSelRow = $("#chooseClientModalTBody").attr("class");
                if (prevSelRow != null) $("#" + prevSelRow).removeClass();
                $("#chooseClientModalTBody").attr("class", rowId);
                $("#"+rowId).attr("class", "info");
            }
            function chooseClientModalSearch() {
                var searchClientName = document.getElementById("chooseClientModalSearchName").value.toLowerCase()
                for (j = 0; j < jsonGotClientsModal.length; j++) {
                    var jsonFullName = jsonGotClientsModal[j].name + " " + jsonGotClientsModal[j].surname + " " + jsonGotClientsModal[j].middlename;
                    if (jsonFullName.toLowerCase().indexOf(searchClientName) + 1 == 0) $("#"+"rowNumber" + j).hide();
                    else $("#"+"rowNumber" + j).show();
                }
            }
            function chooseAddAgreementClient() {
                var client_id = document.getElementById(document.getElementById("chooseClientModalTBody").getAttribute("class")).getAttribute(("data-clientid"));
                $("#addAgreementLabelClient").html("Ok!");
                $("#addAgreementLabelClient").addClass("text-success");                
                for (j=0;j<jsonGotClientsModal.length;j++){
                    if (client_id == jsonGotClientsModal[j].client_id) {
                        $("#addAgreementFieldClient").val(jsonGotClientsModal[j].surname + " " + jsonGotClientsModal[j].name + " " + jsonGotClientsModal[j].middlename);
                        $("#addAgreementFieldClient").attr("class", client_id);
                    }
                }
                $("#chooseClientModal").modal("hide");
            }

            function removeAgreementsFormElement(jsonGot) {
                $("#contentPlace").load("elementsus.html #agreementsUserAll", function() {
                    makeAgreementsFormElementP2(jsonGot);
                    removeAgreementsFormButtons(jsonGot);
                });
            }
            function removeAgreementsFormButtons(jsonGot) {
                $("#expandClientButton").html("Remove agreement");
                $("#expandClientButton").attr("onclick","removeAgreementModal()");
                $("#expandClientButton").addClass("btn-success");
            }
            function removeAgreementModal() { 
                $('#removeAgreementApprModal').modal();
            }
            function removeAgreement() {
                $('#removeAgreementApprModal').modal("hide");
                $("#expandClientButton").html("Wait...");
                $("#expandClientButton").attr("disabled", "disabled");
                var agreement_id = document.getElementById(document.getElementById("agreementsUserAllTBody").getAttribute("class")).getAttribute(("data-clientid"));
                $.ajax({
                    url: "RemoveAgreementServlet",
                    data: {"param1" : agreement_id},
                    error: function() {
                        $("#expandClientButton").html("FAILED");
                        $("#expandClientButton").removeAttr("disabled");
                        alert("Failed!");
                    },
                    success: function(text) {
                        response = text;
                        if (response == "failure") {
                            $("#expandClientButton").html("FAILED");
                            $("#expandClientButton").removeAttr("disabled");
                            alert("Failed!");
                        } else {
                            leftRemoveAgreementsMenuPressed();
                        }
                    }
                });
            }
            function makePaymentsFormElement(jsonGot) {
                $("#contentPlace").load("elementsus.html #paymentUserAll", function() {
                    makePaymentsFormElementP2(jsonGot);
                });
            }
            function makePaymentsFormElementP2(jsonGotP2) {
                for (j=0; j <jsonGotP2.length; j++) {
                    var newRow = document.createElement("tr");
                    newRow.setAttribute("id", "rowNumber" + j);
                    newRow.setAttribute("onclick", "makePaymRowSelected(\"rowNumber" + j + "\")");
                    newRow.setAttribute("data-paymentid", jsonGotP2[j].payment_id);
                    var cell1 = document.createElement("td");
                    cell1.innerHTML = parseInt(jsonGotP2[j].paym_sum)/100;
                    var cell2 = document.createElement("td");
                    cell2.innerHTML = jsonGotP2[j].paym_date;
                    var cell3 = document.createElement("td");                    
                    if ("client" in jsonGotP2[j]) cell3.innerHTML = jsonGotP2[j].client.surname+" "+jsonGotP2[j].client.name+" "+jsonGotP2[j].client.middlename;
                    else {
                        cell3.innerHTML = "N/A";
                        newRow.setAttribute("class", "error");                        
                    }
                    var cell4 = document.createElement("td");
                    cell4.innerHTML = jsonGotP2[j].banks_account.acc_number;
                    var cell5 = document.createElement("td");
                    cell5.innerHTML = jsonGotP2[j].banks_account.bank.name;
                    var cell6 = document.createElement("td");
                    cell6.innerHTML = jsonGotP2[j].paym_purpose;
                    var cell7 = document.createElement("td");
                    if ("client" in jsonGotP2[j]) cell7.innerHTML = "attached";
                    else cell7.innerHTML = "N/A";
                    newRow.appendChild(cell1);
                    newRow.appendChild(cell2);                    
                    newRow.appendChild(cell3);
                    newRow.appendChild(cell4);
                    newRow.appendChild(cell5);
                    newRow.appendChild(cell6);                    
                    newRow.appendChild(cell7);                    
                    document.getElementById("paymentUserAllTBody").appendChild(newRow);
                }
            }


            function searchPayments() {
                document.getElementById("paymentUserAllTBody").innerHTML = "";                
                var jsonGotPaymentsSearch = JSON.parse(JSON.stringify(jsonGotPayments));
                var searchPaymentSum = $("#searchPaymentBySum").val();
                var searchPaymentDate = (Date.parse($("#searchPaymentByDate").val()).toString() == "NaN") ? "" : Date.parse($("#searchPaymentByDate").val());
                var searchPaymentClient = $("#searchPaymentByClient").val();
                var searchPaymentBank = $("#searchPaymentByBank").val();
                var searchPaymentAccount = $("#searchPaymentByAccount").val();
                var searchPaymentPurpose = $("#searchPaymentByPurpose").val();
                var searchPaymentAttached = $("#searchPaymentByAttached").val();
                for (i = 0; i < jsonGotPaymentsSearch.length; i++) {
                    var keepRow = 1;
                    var jsonFullName = ("client" in jsonGotPaymentsSearch[i]) ? (jsonGotPaymentsSearch[i].client.name + " " + jsonGotPaymentsSearch[i].client.surname + " " + jsonGotPaymentsSearch[i].client.middlename) : "N/A";
                    var jsonPaymentDate = Date.parse(jsonGotPaymentsSearch[i].paym_date);                    
                    keepRow *= (jsonGotPaymentsSearch[i].paym_sum.toString().indexOf(searchPaymentSum) + 1);
                    keepRow *= (jsonPaymentDate.toString().indexOf(searchPaymentDate.toString()) + 1);
                    keepRow *= (jsonFullName.toLowerCase().indexOf(searchPaymentClient.toLowerCase()) + 1);
                    keepRow *= (jsonGotPaymentsSearch[i].banks_account.bank.name.indexOf(searchPaymentBank) + 1);
                    keepRow *= (jsonGotPaymentsSearch[i].banks_account.acc_number.indexOf(searchPaymentAccount) + 1);
                    keepRow *= (jsonGotPaymentsSearch[i].paym_purpose.toLowerCase().indexOf(searchPaymentPurpose.toLowerCase()) + 1);
                    if ((searchPaymentAttached.indexOf("attached") > 0)){
                        keepRow *= ("client" in jsonGotPaymentsSearch[i]) ? 0:1;
                    }
                    if ((searchPaymentAttached.indexOf("attached") == 0)){
                        keepRow *= ("client" in jsonGotPaymentsSearch[i]) ? 1:0;
                    } 
                    if ((searchPaymentAttached.indexOf("attached") < 0))  keepRow *= 1;
                    if (keepRow == 0) {
                        jsonGotPaymentsSearch.splice(i, 1);
                        i -= 1;
                    }
                }
                makePaymentsFormElementP2(jsonGotPaymentsSearch);
            }
            function searchPaymentsReset() {
                $("#searchPaymentBySum").val("");
                $("#searchPaymentByDate").val("");
                $("#searchPaymentByClient").val("");
                $("#searchPaymentByBank").val("");
                $("#searchPaymentByAccount").val("");
                $("#searchPaymentByPurpose").val("");
                $("#searchPaymentByAttached").val("any");
                document.getElementById("paymentUserAllTBody").innerHTML = "";
                makePaymentsFormElementP2(jsonGotPayments);
            }
            function makePaymRowSelected(rowid) {
                var prevSelRow = $("#paymentUserAllTBody").attr("class");
                if (prevSelRow != null) $("#"+prevSelRow).removeClass("info");
                if (!$("#"+rowid).hasClass("error")) {
                    $("#attachPaymentButton").html("...");
                    $("#attachPaymentButton").attr("disabled", "disabled");
                    $("#detachPaymentButton").html("Detach payment");
                    $("#detachPaymentButton").removeAttr("disabled");
                } else {
                    $("#detachPaymentButton").html("...");
                    $("#detachPaymentButton").attr("disabled", "disabled");
                    $("#attachPaymentButton").html("Attach payment");
                    $("#attachPaymentButton").removeAttr("disabled");
                }
                $("#paymentUserAllTBody").attr("class", rowid);
                $("#"+rowid).addClass("info");
            }
            function detachPaymentButtonPressed() {
                $("#detachPaymentApprModal").modal();
                $("#detachAgreementModalWait").html("Wait... Loading agreement...");
                $.ajax( {
                    url: "GetUserAgreementsServlet",
                    error: function() {$(location).attr("href","index.jsp");  },
                    success: function(text) {
                        var response = text;
                        if (response == "failure") $(location).attr("href","index.jsp");
                        if (response == "nodata") $("#detachAgreementModalWait").html("Sorry! You don't have any agreements...");
                        if (response != "failure" && response != "nodata") {
                            jsonGotAgreements = JSON.parse(response);
                            var payment_id = document.getElementById(document.getElementById("paymentUserAllTBody").getAttribute("class")).getAttribute(("data-paymentid"));
                            for (j=0; j<jsonGotAgreements.length;j++) {
                                if ("payment" in jsonGotAgreements[j] && jsonGotAgreements[j].payment.payment_id == payment_id) {
                                    $("#agreementDetachNumber").html(jsonGotAgreements[j].agr_number);
                                    $("#agreementDetachName").html(jsonGotAgreements[j].client.name + " " + jsonGotAgreements[j].client.surname);
                                    $("#agreementDetachDate").html(jsonGotAgreements[j].date_written);
                                    $("#agreementDetachSum").html(jsonGotAgreements[j].sum_pay/100);
                                    $("#agreementDetachDateend").html(jsonGotAgreements[j].date_end);
                                    $("#agreementDetachTBody").attr("class", jsonGotAgreements[j].agr_id);
                                }
                            }
                            $("#detachAgreementModalWait").html("");
                        }
                   }
                });                
            }
            function detachPayment() {
                if ($("#detachPaymentModalButton").attr("disabled") == "disabled") return false;
                $("#detachPaymentModalButton").attr("disabled", "disabled");
                $("#detachAgreementModalWait").html("<span class=\"text-error\">Wait... Detachment in progress...</span>");
                var passing = {}
                passing["param1"]= $("#agreementDetachTBody").attr("class");
                $.ajax({
                    url: "DetachUserPaymentServlet",
                    data: passing,
                    error: function() {
                        $("#detachAgreementModalWait").html("<span class=\"text-error\">Detachment failed. Please try again.</span>");
                        $("#detachPaymentModalButton").removeAttr("disabled");
                    },
                    success: function(text) {
                        response = text;
                        if (response == "success") {
                            $("#detachPaymentApprModal").modal("hide");
                            leftAttachPaymentsMenuPressed();
                        } else {
                            $("#detachAgreementModalWait").html("<span class=\"text-error\">Detachment failed. Please try again.</span>");
                            $("#detachPaymentModalButton").removeAttr("disabled");
                        }
                    }
                });
            }
            function attachPaymentButtonPressed() {
                $("#attachPaymentModal").modal();
                $("#attachPaymentModalWait").html("Wait... Loading agreements...");
                $("#attachPaymentModalButton").attr("disabled", "disabled");
                $("#attachPaymentModalTBody").removeAttr("class");
                $.ajax( {
                    url: "GetUserAgreementsServlet",
                    error: function() {$(location).attr("href","index.jsp");  },
                    success: function(text) {
                        var response = text;
                        if (response == "failure") $(location).attr("href","index.jsp");
                        if (response == "nodata") $("#attachPaymentModalWait").html("Sorry! You don't have any agreements...");
                        if (response != "failure" && response != "nodata") {
                            jsonGotAgreements = JSON.parse(response);
                            $("#attachPaymentModalWait").html("");
                            fillAgreementModalTable(jsonGotAgreements);                            
                        }
                   }
                });                
            }
            function fillAgreementModalTable(jsonGotAgreements) {
                $("#attachPaymentModalTBody").html("");
                for (j=0;j<jsonGotAgreements.length;j++) {
                    if ("payment" in jsonGotAgreements[j]) {
                        jsonGotAgreements.splice(j, 1);
                        j -= 1;
                    }
                }
                for (j=0;j<jsonGotAgreements.length;j++) {
                        var newRow = document.createElement("tr");
                        newRow.setAttribute("id", "rowAgrNumber" + j);
                        newRow.setAttribute("onclick", "makeAgrModalRowSelected(\"rowAgrNumber" + j + "\")");
                        newRow.setAttribute("data-paymentid", jsonGotAgreements[j].agr_id);
                        var cell1 = document.createElement("td");
                        cell1.innerHTML = jsonGotAgreements[j].agr_number;
                        var cell2 = document.createElement("td");
                        cell2.innerHTML = jsonGotAgreements[j].client.surname+" "+jsonGotAgreements[j].client.name+" "+jsonGotAgreements[j].client.middlename;
                        var cell3 = document.createElement("td");
                        cell3.innerHTML = jsonGotAgreements[j].date_written;
                        var cell4 = document.createElement("td");
                        cell4.innerHTML = jsonGotAgreements[j].sum_pay/100;
                        var cell5 = document.createElement("td");
                        cell5.innerHTML = jsonGotAgreements[j].date_pay;
                        newRow.appendChild(cell1);
                        newRow.appendChild(cell2);
                        newRow.appendChild(cell3);
                        newRow.appendChild(cell4);
                        newRow.appendChild(cell5);
                        document.getElementById("attachPaymentModalTBody").appendChild(newRow);
                }                                
            }
            function makeAgrModalRowSelected(rowId) {
                var prevSelRow = $("#attachPaymentModalTBody").attr("class");
                if (prevSelRow == null) $("#attachPaymentModalButton").removeAttr("disabled");
                if (prevSelRow != null) $("#" + prevSelRow).removeClass();
                $("#attachPaymentModalTBody").attr("class", rowId);
                $("#"+rowId).attr("class", "info");
            }
            function attachPaymentModalSearch() {
                var searchAgrNumber = document.getElementById("attachPaymentModalSearchNumber").value.toLowerCase()
                var searchAgrName = document.getElementById("attachPaymentModalSearchName").value.toLowerCase()
                for (j = 0; j < jsonGotAgreements.length; j++) {
                    var jsonFullName = jsonGotAgreements[j].client.name + " " + jsonGotAgreements[j].client.surname + " " + jsonGotAgreements[j].client.middlename;
                    if (jsonFullName.toLowerCase().indexOf(searchAgrName) + 1 == 0 || jsonGotAgreements[j].agr_number.indexOf(searchAgrNumber)<0) $("#"+"rowAgrNumber" + j).hide();
                    else $("#"+"rowAgrNumber" + j).show();
                }
            }
            function attachPaymentModal() {
                if ($("#attachPaymentModalButton").attr("disabled") == "disabled") return false;
                $("#attachPaymentModalButton").attr("disabled", "disabled");
                $("#attachPaymentModalWait").html("<span class=\"text-info\">Wait... Attachment in progress...</span>");
                var passing = {}
                passing["param1"]= document.getElementById(document.getElementById("attachPaymentModalTBody").getAttribute("class")).getAttribute(("data-paymentid"));
                passing["param2"]= document.getElementById(document.getElementById("paymentUserAllTBody").getAttribute("class")).getAttribute(("data-paymentid"));
                $.ajax({
                    url: "AttachUserPaymentServlet",
                    data: passing,
                    error: function() {
                        $("#attachPaymentModalWait").html("<span class=\"text-error\">Detachment failed. Please try again.</span>");
                        $("#attachPaymentModalButton").removeAttr("disabled");
                    },
                    success: function(text) {
                        response = text;
                        if (response == "success") {
                            $("#attachPaymentModal").modal("hide");
                            leftAttachPaymentsMenuPressed();
                        } else {
                        $("#attachPaymentModalWait").html("<span class=\"text-error\">Attachment failed. Please try again.</span>");
                        $("#attachPaymentModalButton").removeAttr("disabled");
                        }
                    }
                });
            }
            function fillBanksInfo(jsonGotBanks) {
                $("#contentPlace").html("");
                for (i = 0; i < jsonGotBanks.banks.length; i ++) {
                    $("#contentPlace").append("<h3>Bank: " + jsonGotBanks.banks[i].name + "</h3>");
                    $("#contentPlace").append("<table class=\"table\"><thead>" + 
                        "<tr><th>MFO</th><th>EDRPOU</th><th>Address</th><th>Email</th><th>Telephone</th></tr>" +
                        "</thead><tbody><tr>" + 
                        "<td>"+ jsonGotBanks.banks[i].mfo + "</td>" + 
                        "<td>"+ jsonGotBanks.banks[i].edrpou + "</td>" + 
                        "<td>"+ jsonGotBanks.banks[i].address + "</td>" + 
                        "<td>"+ jsonGotBanks.banks[i].email + "</td>" + 
                        "<td>"+ jsonGotBanks.banks[i].telephone + "</td></tr></tbody></table>");
                    $("#contentPlace").append("<h4>Accounts:</h4>");
                    $("#contentPlace").append("<table class=\"table\"><thead>" + 
                        "<tr><th>Acc. number</th><th>Currency</th><th>State</th></tr>" + 
                        "</thead><tbody id=\"bank" + i + "\"></tbody></table>");
                    for (j=0; j < jsonGotBanks.banks_accounts.length; j++) {
			if (jsonGotBanks.banks[i].bank_id == jsonGotBanks.banks_accounts[j].bank.bank_id) {
                            $("#bank"+i).append("<tr><td>" + jsonGotBanks.banks_accounts[j].acc_number + "</td><td>" + jsonGotBanks.banks_accounts[j].currency + "</td><td>" + jsonGotBanks.banks_accounts[j].acc_state + "</td></tr>");
                        }
                    }
                        
                }
            }