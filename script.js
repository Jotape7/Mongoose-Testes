const { default: mongoose } = require("mongoose")
const User = require("./User")

// Fazendo conexão com o banco Sandbox
mongoose.connect("mongodb+srv://m001-student:m001-mongodb-basics@sandbox.ub5rddy.mongodb.net/?retryWrites=true&w=majority", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

// Testando a conexão com uma mensagem de sucesso!
const db = mongoose.connection;
db.on("error", (error) => console.error(error));
db.once("open", () => console.log("Conexão com banco realizada com sucesso!"));




// Criando um usuário atraves de uma função
async function run() {
    const user = new User({ name: "Kyle", age: 26 })
    await user.save()
    console.log(user)
}

// Criando um usuário com o .create()
async function run2() {
    const user = await User.create({ name: "Tom", age: 16 })
    console.log(user)
}

async function changeName() {
    const user = await User.create({ name: "Tom", age: 16 })
    user.name = "Sally"
    await user.save()
    console.log(user)
}


// Criando um usuário com mais propriedades, como hobbies...
async function run3() {
    const user = await User.create({ 
        name: "Miles", 
        age: 18,
        hobbies: ["Weight Lifting", "Bowling"], 
        address: {
            street: "Main St",
        }
    })
    console.log(user)
}

// Criando uma função para criar usuário porém com um try catch para vizualizar o erro melhor...
async function run4() {
    try{
        const user = await User.create({ 
            name: "Miles", 
            age: 27,
            email: "TEST2@email.com",
            hobbies: ["Weight Lifting", "Bowling"], 
            address: {
                street: "Main St",
            },
        })
        console.log(user)
    } catch (e) {
        console.log(e.message)
    }
}



// Procurando um usuário pelo ID
async function findUser() {
    try{
        const users =  await User.exists({name: "Kyle" })
        console.log(users)
    } catch (e) {
        console.log(e.message)
    }
}



// Deletando um usuário 
async function deleteUser() {
    try{
        const users =  await User.deleteOne({name: "Kyle" })
        console.log(users)
    } catch (e) {
        console.log(e.message)
    }
}


// Usando querys 
async function findUserWhere() {
    try{
        const user =  await User.where("age").gt(12).lt(31).where("name").equals("Miles").limit(1).select("age")
        console.log(user)
    } catch (e) {
        console.log(e.message)
    }
}




// Atribuindo um best friend
async function bestFriend() {
    try{
        const user =  await User.where("age")
            .gt(12)
            .where("name")
            .equals("Miles")
            .limit(1)
            .select("age")
        user[0].bestFriend = "62f69d05ab6ddbf67c4d1e70"
        await user[0].save()
        console.log(user)
    } catch (e) {
        console.log(e.message)
    }
}


// Vizualizando um usuario com o best friend
async function findBf() {
    try{
        const user =  await User.where("age")
            .gt(12)
            .where("name")
            .equals("Miles")
            .limit(1)
        console.log(user)
    } catch (e) {
        console.log(e.message)
    }
}



// Usando populate para "unir" os documentos
async function findPop() {
    try{
        const user =  await User.where("age")
            .gt(12)
            .where("name")
            .equals("Miles")
            .populate("bestFriend")
            .limit(1)
        console.log(user)
    } catch (e) {
        console.log(e.message)
    }
}




// Testando o method criado "sayHi"
async function Hi() {
    try{
        const user =  await User.findOne({ name: "Miles" })
        console.log(user)
        user.sayHi()
    } catch (e) {
        console.log(e.message)
    }
}


// Testando o static
async function staticTest() {
    try{
        const user =  await User.findByName("Kyle")
        console.log(user)
    } catch (e) {
        console.log(e.message)
    }
}



// Testando a função na query
async function test() {
    try{
        const user =  await User.find().byName("Kyle")
        console.log(user)
    } catch (e) {
        console.log(e.message)
    }
}




// Testando a virtual
async function testV() {
    try{
        const user =  await User.findOne({ name: "Miles", email: "test2@email.com"})
        console.log(user)
        console.log(user.namedEmail)
    } catch (e) {
        console.log(e.message)
    }
}


// Testando o middleware
async function testM() {
    try{
        const user =  await User.findOne({ name: "Miles", email: "test2@email.com" })
        await user.save()
        console.log(user)
    } catch (e) {
        console.log(e.message)
    }
}

testA()
// Testando o aggregate
async function testA() {
    try{
        const user =  User.aggregate([
            { $match: { age: { $lte : 25 }}},
            { $project: { name: 1 } },
            { $limit: 3 }
        ])
        for await (const doc of user) {
            console.log(doc.name);
        }
        
    } catch (e) {
        console.log(e.message)
    }
}





// Pode usar o .then invés da função async com await
// user.save().then(() => console.log("Usuário salvo no banco!") )