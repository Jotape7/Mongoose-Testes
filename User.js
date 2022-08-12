const mongoose = require("mongoose")

// Criando um Schema para o adress para depois colocar no User...
const adressSchema = new mongoose.Schema({
    street: String,
    city: String,
})

// Criando um Schema
const userSchema = new mongoose.Schema({
    name: String,
    age: {
        type: Number,
        min: 1,
        max: 100,
        validate: {
            validator: v => v % 2 === 0,
            message: props => `${props.value} não é um numero par `
        }
    },
    email: {
        type: String,
        minLenght: 10,
        required: true,
        lowercase: true,
    },
    createdAt: {
        type: Date,
        immutable: true,
        default: () => Date.now(),
    },
    updateAt: {
        type: Date,
        default: () => Date.now(),
    },
    bestFriend: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: "User",
    },
    hobbies: [String],
    address: adressSchema,
})

// Criando methods
userSchema.methods.sayHi = function() {
    console.log(`Hi. My name is ${this.name}`)
}

// Criando statics
userSchema.statics.findByName = function (name) {
    return this.find({ name: new RegExp(name, "i") })
}

// Criando uma função para uma query
userSchema.query.byName = function (name) {
    return this.where({ name: new RegExp(name, "i") })
}

// Criando e manipulando uma Virtual
userSchema.virtual("namedEmail").get(function() {
    return `${this.name} <${this.email}>`
})

// Usando middlewares no mongoose -- PRE
userSchema.pre("save", function (next) {
    this.updateAt = Date.now()
    throw new Error("Fail Save")
})

// Usando middlewares no mongoose -- POST
userSchema.post("save", function (doc, next) {
    doc.sayHi()
    next()
})

// Criando um model com o Schema e exportando
module.exports = mongoose.model("User", userSchema)