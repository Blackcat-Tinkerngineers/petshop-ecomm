const router = require('express').Router();
const { Tag, Product, ProductTag } = require('../../models');

router.get('/', (req, res) => {
  Tag.findAll({
    include: [
      {
        model: Product,
        attributes: ['id', 'product_name', 'price', 'stock']
      }
    ],
  })
    .then((dbTagsData) => res.status(200).json(dbTagsData))
    .catch(err => {
      res.status(500).json(err);
    });
});

router.get('/:id', (req, res) => {
  Tag.findOne({
    where: {
      id: req.params.id,
    },
    include: [
      {
        model: Product,
        attributes: ['id', 'product_name', 'price', 'stock', 'category_id']
      }
    ]
  })
    .then(tagData => {
      if (!tagData) {
        res.status(404).json({ message: 'Unable to locate tag with this id' });
        return;
      }
      res.json(tagData);
    })
    .catch(err => {
      res.status(500).json(err);
    });
});


router.post('/', (req, res) => {
  Tag.create(req.body)
    .then((newTag) => { res.json(newTag) })
    .catch(err => {
      res.status(500).json(err);
    });
});

router.put('/:id', (req, res) => {
  Tag.update({
    tag_name: req.body.tag_name,
  },
    {
      where: {
        id: req.params.id,
      },
    })
    .then((updateTag) => {
      res.json(updateTag);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json(err);
    });
});

router.delete('/:id', (req, res) => {
  Tag.destroy({
    where: {
      id: req.params.id
    },
  })
    .then((deleteTag) => {
      res.json(deleteTag);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json(err);
    });
});


module.exports = router;