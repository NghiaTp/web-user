import express from 'express';
import Voucher from '../models/VoucherModel.js';

const router = express.Router();


// http://192.168.1.114:8010/api/voucher/all

// GET all vouchers
router.get('/all', async (req, res) => {
  try {
    const vouchers = await Voucher.find();
    res.json(vouchers);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET a voucher by ID 
// http://192.168.1.114:8010/api/voucher/id
router.get('/:id', getVoucher, (req, res) => {
  res.json(res.voucher);
});

// CREATE a new voucher
// http://192.168.1.114:8010/api/voucher/add

router.post('/add', async (req, res) => {
  const voucher = new Voucher({
    _id: req.body._id,
    price: req.body.price,
    description: req.body.description,
    date: req.body.date,
    image: req.body.image
  });

  try {
    const newVoucher = await voucher.save();
   
    res.status(201).json(newVoucher);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// UPDATE a voucher
// http://192.168.1.114:8010/api/voucher/update
router.patch('/:id', getVoucher, async (req, res) => {
  if (req.body.price != null) {
    res.voucher.price = req.body.price;
  }
  if (req.body.description != null) {
    res.voucher.description = req.body.description;
  }
  if (req.body.date != null) {
    res.voucher.date = req.body.date;
  }
  if (req.body.image != null) {
    res.voucher.image = req.body.image;
  }
  try {
    const updatedVoucher = await res.voucher.save();
    res.json(updatedVoucher);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// DELETE a voucher
router.delete('/delete-all', async (req, res) => {
  try {
    await Voucher.deleteMany({});
    res.json({ message: 'Deleted Voucher' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Middleware function to get voucher by ID
async function getVoucher(req, res, next) {
  let voucher;
  try {
    voucher = await Voucher.findById(req.params.id);
    if (voucher == null) {
      return res.status(404).json({ message: 'Cannot find voucher' });
    }
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
  res.voucher = voucher;
  next();
}

export default router;
