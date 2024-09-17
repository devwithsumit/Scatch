const express = require("express")
const router = express.Router()
const ownerModel = require("../models/owner")
router.get("/", async function (req, res) {
    res.send('working fine');
})
if(process.env.NODE_ENV === 'development'){
    router.post("/create",async function (req, res) {
        let owners = await ownerModel.find();
        if(owners.length > 0){
            return res.status(401).send("You don't have permissions !")
        }

        try {
            let { fullname, email, password } = req.body;
            const createOwner = await ownerModel.create({
                fullname,
                email,
                password,
            })
            res.send(createOwner);
        } catch (error) {
            res.send(error.message)
        }
    })

}

module.exports = router;