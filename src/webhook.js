const getContentType = sys => sys.contentType.sys.id;
const getDefaultLanguage = field => field["en-US"];
const twilio = require("./twilio");
const contentful = require("./contentful");
const secret = require("../secret");

const contentTypes = {
  question: "question",
  questionVariation: "questionVariation"
};

const getEntry = async id => {
  const space = await contentful.getSpace(secret.contentfulSpaceId);
  const entry = await space.getEntry(id);
  return entry;
};

const updateAutopilotSid = async (entrySid, autopilotId) => {
  const entry = await getEntry(entrySid);
  console.log(entry.fields, entry.fields.autopilotId);
  entry.fields.autopilotId = {
    "en-US": autopilotId,
  };
  await entry.update();
};

// twilio.autopilot.assistants(hannahbotSid).tasks();

module.exports = async ({ fields, sys }) => {
  const { body, answer, variations } = fields;

  switch (getContentType(sys)) {
    case contentTypes.question: {
      return handleQuestion(fields, sys.id);
    }
    case contentTypes.questionVariation: {
      return console.log(body);
    }
    default: {
      return console.log("nothing");
    }
  }
};

const handleQuestion = async (fields, id) => {
  const { body, answer, variations, autopilotSid } = fields;

  if (!autopilotSid) {
    try {
      const newTask = await twilio.autopilot
        .assistants(hannahbotSid)
        .tasks.create({
          uniqueName: getDefaultLanguage(body).replace(/[^a-zA-Z0-9]/g, "_"),
          friendlyName: getDefaultLanguage(body),
          actions: {
            actions: [
              {
                say: getDefaultLanguage(answer)
              }
            ]
          }
        });
      await twilio.autopilot
        .assistants(hannahbotSid).tasks(newTask.sid).samples.create({
          taggedText: getDefaultLanguage(body),
          language: "en-US"
        });
      await twilio.autopilot
        .assistants(hannahbotSid).modelBuilds.create();
      await updateAutopilotSid(id, newTask.sid);
    } catch (e) {
      console.error(e);
    }
  }
};
