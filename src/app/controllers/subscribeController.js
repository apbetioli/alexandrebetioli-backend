const express = require("express");
const router = express.Router();
const mailchimp = require("@mailchimp/mailchimp_marketing");
const md5 = require("md5");

const listId = process.env.MAILCHIMP_LIST_ID;

mailchimp.setConfig({
  apiKey: process.env.MAILCHIMP_API_KEY,
  server: process.env.MAILCHIMP_SERVER,
});

router.post("/subscribe", async (req, res) => {
  try {
    let lead = req.body;
    let subscriberHash = md5(lead.email.toLowerCase());

    console.log(lead);

    const response = await mailchimp.lists.setListMember(
      listId,
      subscriberHash,
      {
        email_address: lead.email,
        status: "pending",
        status_if_new: "pending",
      }
    );

    lead.id = response.id;

    await mailchimp.lists.updateListMemberTags(listId, subscriberHash, {
      body: {
        tags: [
          {
            name: lead.tag,
            status: "active",
          },
        ],
      },
    });

    res.status(201).send(lead);
  } catch (e) {
    console.log(e);
    res.status(400).send({
      error:
        "Não foi possível completar o cadastro. Tente novamente em alguns minutos.",
    });
  }
});

module.exports = router;
