const express = require('express');
const mongoose = require('mongoose');
const app = express();
const PORT = process.env.PORT || 3000;
// Connect to MongoDB (Host will be the K8s Service Name)
const mongoURI = process.env.MONGO_URI ||
    'mongodb://localhost:27017/electricityDB';
mongoose.connect(mongoURI);
const UsageSchema = new mongoose.Schema({}, { strict: false });
const UserSchema = new mongoose.Schema({}, { strict: false });
const Usage = mongoose.model('Usage', UsageSchema, 'usages');
const User = mongoose.model('User', UserSchema, 'users');
app.get('/api/stats/:year', async (req, res) => {
    try {
        const year = parseInt(req.params.year);
        // Aggregate Total Usage
        const usageData = await Usage.find({ year: year });
        const totalUsage = usageData.reduce((acc, curr) => {
            return acc + (curr.residential_kwh + curr.small_business_kwh +
                curr.medium_business_kwh + curr.large_business_kwh);
        }, 0);
        // Aggregate Total Users
        const userData = await User.find({ year: year });
        const totalUsers = userData.reduce((acc, curr) => {
            return acc + (curr.residential_count +
                curr.small_business_count + curr.medium_business_count);
        }, 0);
        res.json({
            year, totalUsageKwh: totalUsage, totalUsersCount:
                totalUsers
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));