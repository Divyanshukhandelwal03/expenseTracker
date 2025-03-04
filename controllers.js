const expense = require('./models.js')


exports.addExpense = async(req,res)=>{
        try {
            console.log(req.body);
            const {amount,category,date,description} = req.body;
            const newExpense = new expense({amount,category,date,description});
            await newExpense.save();
            res.status(201).json({ message: 'Expense created successfully', expense: newExpense });
        } catch (error) {
            console.log(error);
            res.status(400).json({ error: error.message });
        }
};

exports.getExpenses = async (req, res) => {
    console.log(req.query);
    
    try {
        let filter = {};

        // Extract query parameters
        const { category, startDate, endDate } = req.query;

        // Category filter (case-insensitive)
        if (category) {
            filter.category = { $regex: category, $options: 'i' };
        }

        // Date filtering logic
        if (startDate && endDate) {
            filter.date = { $gte: startDate, $lte: endDate }; // Between start and end
        } else if (startDate) {
            filter.date = { $gte: startDate }; // Start date and later
        } else if (endDate) {
            filter.date = { $lte: endDate }; // Up to end date
        }

        // Fetch expenses based on filters
        const expenses = await expense.find(filter);
        res.status(200).json(expenses);
        
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};



// covered inside the getExpenses module part
// exports.filterExpenses = async(req,res)=>{
//        const category = req.query.category;
//        const date = req.query.date;
// };

const getTotalExpenses = async (start, end, category) => {
    try {
        let matchQuery = {};

        if (start && end) {
            matchQuery.date = { $gte: new Date(start), $lte: new Date(end) };
        } else if (start) {
            matchQuery.date = { $gte: new Date(start) };
        } else if (end) {
            matchQuery.date = { $lte: new Date(end) };
        }

        if (category) {
            matchQuery.category = category;
        }

        const total = await expense.aggregate([
            {
                $match: matchQuery
            },
            {
                $group: { _id: null, totalAmount: { $sum: '$amount' } }
            }
        ]);

        return { total: total[0]?.totalAmount || 0 };
    } catch (error) {
        console.error(error);
        throw new Error(error.message);
    }
};


exports.totalExpenses = async(req,res)=>{
    try {
        const { start, end,category } = req.query;
        console.log(req.query);

        // if (!start || !end) {
        //     return res.status(400).json({ error: 'Start and end dates are required' });
        // }

        // const total = await expense.aggregate([
        //     {
        //         $match: {
        //             date: { $gte: new Date(start), $lte: new Date(end) }
        //         }
        //     },
        //     {
        //         $group: { _id: null, totalAmount: { $sum: '$amount' } }
        //     }
        // ]);
        
       const total=await getTotalExpenses(start, end,category );
       console.log(total);

        res.status(200).json(total);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: error.message });
    }

};