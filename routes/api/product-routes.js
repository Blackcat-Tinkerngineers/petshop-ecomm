const router = require('express').Router();
const { Product, Category, Tag, ProductTag } = require('../../models');

router.get('/', (req, res) => {
  Product.findAll({
    include:
      [{
        model: Tag,
        attributes: ['id', 'tag_name']
      }],
    include:
      [{
        model: Category,
        attributes: ['id', 'category_name']
      }]
  })
    .then(dbProductData => res.json(dbProductData))
    .catch(err => {
      console.log(err);
      res.status(500).json(err);
    });
});

router.get('/:id', (req, res) => {
  Product.findOne({
    where: {
      id: req.params.id,
    },
    include: [{
      model: Tag,
      attributes: ['id', 'tag_name']
    }],
    include: [{
      model: Category,
      attributes: ['id', 'category_name']
    }],
  })
    .then((dbProductData) => {
      if (!dbProductData) {
        res.status(404).json({ message: 'No product found with this id' });
        return;
      }
      res.json(dbProductData);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json(err);
    });
});

router.post('/', (req, res) => {
  Product.create(req.body)
    .then((product) => {
      if (req.body.tagIds.length) {
        const productTagIdArr = req.tagIds.map((tag_id) => {
          return {
            product_id: product.id,
            tag_id: tag_id
          };
        });
        return ProductTag.bulkCreate(productTagIdArr);
      }
      res.status(200).json(product);
    })
    .then((productTagsIds) => { res.json(productTagsIds) })
    .catch((err) => {
      console.log(err);
      res.status(500).json(err);
    });
});

router.put('/:id', (req, res) => {
  Product.update(req.body,
    {
      where: {
        id: req.params.id,
      },
    })
    .then((product) => {
      return ProductTag.findAll({ where: { product_id: req.params.id } });
    })
    .then((productTags) => {
      const productTagsIds = productTags.map(({ tag_id }) => tag_id);
      const newProductTagsIds = req.body.tagIds
        .filter(tag_id => !productTagsIds.includes(tag_id))
        .map((tag_id) => {
          return {
            product_id: req.params.id,
            tag_id: tag_id
          };
        });
      const productTagsToDelete = productTagsIds
        .filter(tag_id => !req.body.tagIds.includes(tag_id))
        .map(({ id }) => id);
      return Promise.all([
        ProductTag.destroy({ where: { id: productTagsToDelete } }),
        ProductTag.bulkCreate(newProductTagsIds)
      ]);
    })
    .then((updatedProductTags) => res.json(updatedProductTags))
    .catch((err) => {
      console.log(err);
      res.status(500).json(err);
    });

  router.delete('/:id', (req, res) => {
    Product.destroy({
      where: {
        id: req.params.id,
      },
    })
      .then((deleteProduct) => {
        res.json(deleteProduct);
      })
      .catch((err) =>
        res.status(500).json(err));
  });
});


module.exports = router;