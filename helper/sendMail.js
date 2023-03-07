const convertMoney = require('./convertMoney').convertMoney;
const nodemailer = require('nodemailer');
const sendGridtranporter = require('nodemailer-sendgrid-transport');
const transporter = nodemailer.createTransport(
  sendGridtranporter({
    auth: {
      api_key:
        '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',
    },
  })
);

exports.sendMailHandler = (cart, address, fullname, idUser, phone, to) => {
  let billTotal = 0;
  cart.products.forEach(
    (prod) => (billTotal += prod.priceProduct * prod.count)
  );
  const content = cart.products.map(
    (product) =>
      `<tr style='border-bottom: 1px solid #ddd'>
  <td>
    <img src=${product.img} alt='...' width='70' />
    </td>
    <td>
    <div>${product.nameProduct}</div>
    </td>
    <td>
    <p>${convertMoney(product.priceProduct)}</p>
    </td>
    <td style='text-align:center'>${product.count}</td>
    <td>
    <p>${convertMoney(product.priceProduct * product.count)}</p>
    </td>
    </tr>`
  );
  // send mail
  const sendedEmail = transporter.sendMail({
    from: 'liemhup@gmail.com',
    to,
    subject: fullname,
    html: `<body>
    <h1>Xin chao ${fullname}</h1>
    <p>Phone: ${phone}</p>
    <p>Address: ${address}</p>
    <table style='border: 1px solid #red; border-collapse: collapse'>
      <thead >
        <tr style='border-bottom: 1px solid #ddd'>
          <th>
            <strong>Image</strong>
          </th>
          <th>
            <strong>Product</strong>
          </th>
          <th>
            <strong>Price</strong>
          </th>
          <th>
            <strong>Quantity</strong>
          </th>
          <th>
            <strong>Total</strong>
          </th>
        </tr>
      </thead>
      <tbody >
        ${content}
      </tbody>
    </table>
    <h2>Tổng thanh toán:<h2>
    <h3> ${convertMoney(billTotal)} </h3>
    <h3> Cảm ơn bạn! </h3>
  </body>`,
  });
};
