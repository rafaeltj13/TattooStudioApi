const COSTUMER = {
    NOME_COMPLETO_USUARIO_TAMANHO_MINIMO: 5,
    NOME_COMPLETO_USUARIO_TAMANHO_MAXIMO: 50,
    EMAIL_REGEX: /^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/,
    PHONE_NO_REGEX: /^[1-9]{2}9?[0-9]{8}$/
}

module.export = Object.freeze({
    ...COSTUMER
})