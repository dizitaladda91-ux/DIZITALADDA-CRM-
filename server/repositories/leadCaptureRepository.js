import pool from "../config/db.js";

export const findLeadByMobileRepository = async (
  mobile
) => {

  const result = await pool.query(

    `
      SELECT *

      FROM leads

      WHERE mobile = $1

      AND is_deleted = FALSE;
    `,

    [mobile]

  );

  return result.rows[0];

};

export const findLeadByEmailRepository = async (
  email
) => {

  const result = await pool.query(

    `
      SELECT *

      FROM leads

      WHERE email = $1

      AND is_deleted = FALSE;
    `,

    [email]

  );

  return result.rows[0];

};

export const createPublicLeadRepository = async (
  client,
  lead
) => {

  const query = `

    INSERT INTO leads (

      lead_code,

      campaign_id,

      full_name,

      mobile,

      email,

      source,

      utm_source,

      utm_medium,

      utm_campaign,

      utm_content,

      utm_term,

      external_lead_id,

      domain,

      interested_course,

      captured_at,

      status

    )

    VALUES (

      $1,$2,$3,$4,$5,$6,
      $7,$8,$9,$10,$11,
      $12,$13,$14,$15,$16

    )

    RETURNING *;

  `;

  const values = [

    lead.lead_code,

    lead.campaign_id,

    lead.full_name,

    lead.mobile,

    lead.email,

    lead.source,

    lead.utm_source,

    lead.utm_medium,

    lead.utm_campaign,

    lead.utm_content,

    lead.utm_term,

    lead.external_lead_id,

    lead.domain || null,

    lead.interested_course || null,

    lead.captured_at,

    "NEW"

  ];

  const result =
    await client.query(query, values);

  return result.rows[0];

};

export const createLeadActivityRepository = async (
  client,
  activity
) => {

  const query = `

    INSERT INTO lead_activity_logs (

      lead_id,
      activity,
      description,
      performed_by

    )

    VALUES (

      $1,$2,$3,$4

    );

  `;

  await client.query(query, [

    activity.lead_id,
    activity.activity,
    activity.description,
    activity.performed_by

  ]);

};

export const updateExistingLeadRepository = async (
  client,
  id,
  lead
) => {

  const query = `

    UPDATE leads

    SET

      campaign_id = $1,
      source = $2,

      utm_source = $3,
      utm_medium = $4,
      utm_campaign = $5,
      utm_content = $6,
      utm_term = $7,

      external_lead_id = $8,

      domain = $9,
      interested_course = $10,

      captured_at = CURRENT_TIMESTAMP,

      updated_at = CURRENT_TIMESTAMP

    WHERE id = $11

    RETURNING *;

  `;

  const values = [

    lead.campaign_id,
    lead.source,

    lead.utm_source,
    lead.utm_medium,
    lead.utm_campaign,
    lead.utm_content,
    lead.utm_term,

    lead.external_lead_id,

    lead.domain || null,

    lead.interested_course || null,

    id

  ];

  const result =
    await client.query(query, values);

  return result.rows[0];

};

export const findLeadByMobileOrEmailRepository = async (

  mobile,

  email

) => {

  const result = await pool.query(

    `

      SELECT *

      FROM leads

      WHERE

      (

        mobile = $1

        OR

        email = $2

      )

      AND is_deleted = FALSE

      LIMIT 1;

    `,

    [

      mobile,

      email

    ]

  );

  return result.rows[0];

};

export const getNextLeadCodeRepository = async (
  client
) => {

  const result = await client.query(`
    SELECT nextval('lead_code_seq') AS sequence;
  `);

  return result.rows[0].sequence;

};
