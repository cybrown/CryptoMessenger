$(function() {

    var EncryptString = function(str, passphrase) {
        return CryptoJS.AES.encrypt(str, passphrase).toString()
    };

    var DecryptString = function(str, passphrase) {
        return CryptoJS.AES.decrypt(str, passphrase).toString(CryptoJS.enc.Utf8)
    };

    var crypt_passphrase = "";

    var continue_receive = false;

    $("#btnConnect").on("click", function(ev) {
        crypt_passphrase = prompt("Mot de passe");
        $.get("/connect", {"username": $("#txtUsername").val(), "pwd": $("#pwdPassword").val()})
            .done(function(data) {
                if (!data.success) {
                    alert("Connexion échouée: " + data.msg);
                }
                else {
                    $("#lblUsername").text($("#txtUsername").val());
                    $("#divLogin").hide();
                    $("#divLogged").show();
                    $("#txtUsername").text("");
                    $("#pwdPassword").text("");
                }
                continue_receive = true;
                receive();
            });
    });

    $("#frmSend").on("submit", function(ev) {
        ev.preventDefault();
        ev.stopPropagation();
        var dataToSend = EncryptString($("#txtSend").val(), crypt_passphrase);
        $.get("/send", {"msg": dataToSend})
            .fail(function(data) {
                alert("Envoi échoué.");
            });
        return false;
    });

    var receive = function() {
        $.get("/receive")
            .done(function(data) {
                if ($.isPlainObject(data)) {
                    var dataReceived = DecryptString(data.msg, crypt_passphrase);
                    var new_div = $("<p></p>");
                    $("#divHistory").append(new_div);
                    if (dataReceived === "") {
                        new_div.text(data.from + ": " + "[Decryption failed...]");
                    }
                    else {
                        new_div.text(data.from + ": " + dataReceived);
                    }
                }
                // TODO Disconnect if null ?
            })
            .always(function() {
                setTimeout(function() {
                    if (continue_receive)
                        receive();
                }, 10);
            });
    };

    var username = prompt("Choisissez un pseudonyme sur le salon de discussion chiffré");
    crypt_passphrase = prompt("Saississez le mot de passe de chiffrement");
    $.get("/connect", {"username": username})
        .done(function(data) {
            if (!data.success) {
                alert("Connexion échouée: " + data.msg);
            }
            else {
                $("#lblUsername").text($("#txtUsername").val());
                $("#divLogin").hide();
                $("#divLogged").show();
                $("#txtUsername").text("");
                $("#pwdPassword").text("");
            }
            continue_receive = true;
            console.log("ok");
            receive();
        });
});
