



function isAvailableEmail(sEmail) {
    var reg = /^(\w+)(\.\w+)*@(\w+)(\.\w+)*.(\w+)$/i;
    return reg.test(sEmail);
}