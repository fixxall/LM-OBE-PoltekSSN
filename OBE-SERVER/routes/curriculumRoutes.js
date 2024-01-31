const curriculumRoutes = require("express").Router();
const { Curriculum } = require("./../models/curriculum");
const { Term } = require("./../models/term");

curriculumRoutes.get('/', async(req, res) => {
    let curriculums = await Curriculum.find();
    console.log("Getter")
    curriculums = await Promise.all(curriculums.map(async(ele) => {
        const terms = await Term.find().where('curriculumId').equals(ele._id.toString());
        ele['_doc']['terms'] = terms || [];
        return ele;
    }));
    return res.status(200).json({ curriculums: curriculums }).end();
});

curriculumRoutes.post('/add-curriculum', async(req, res) => {
    const curriculum = new Curriculum({...req.body });
    curriculum.save(async(error, response) => {
        if (error) {
            return res.status(500).json({ response: null, error: error, message: "Unable To Add Curriculum" }).end();
        } else {
            let termArray = Array(8).fill(" ").map((item, idx) => ({
                termName: String(idx + 1),
                termNo: idx + 1,
                curriculumId: response._id,
                curriculumName: response.curriculumName,
                deptName: response.deptName
            }));
            await Term.insertMany([...termArray]);
            return res.status(200).json({ response: response, error: null, message: "Curriculum Added Successfully" }).end();
        }
    })
});

curriculumRoutes.put('/update-curriculum/:_id', (req, res) => {
    let query = {};
    for (let key in req.body) {
        if (key !== "_id") query[key] = req.body[key];

    }
    Curriculum.findByIdAndUpdate(req.params._id, {
        $set: {...query }
    }, { new: true }, (error, response) => {
        if (error) {
            return res.status(500).json({...error, message: "Something Went Wrong!!" }).end();
        } else {
            return res.status(200).json({ response: response, message: "Batch Updated successfully" }).end();
        }
    })
})

curriculumRoutes.delete("/delete/:curriculumId", (req, res) => {
    Curriculum.findByIdAndDelete(req.params.curriculumId, (err, msg) => {
        if (err) {
            return res.status(500).json({...err, message: "Something Went Wrong!!" }).end();
        } else {
            return res.status(200).json({ date: new Date(), message: "Curriculum Delete successfully" }).end();
        }
    })
});

module.exports = { curriculumRoutes };