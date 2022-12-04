import {InputBoundaryInterface} from "../../interfaces/input-boundary-interface.js";

export default class TranscriptsController {

  static #inputBoundary

  static setTranscriptInteractor(interactor) {
    if(interactor instanceof InputBoundaryInterface){
      this.#inputBoundary = interactor;
    } else {
      throw new Error("not an InputBoundary");
    }
  }

  static #outputBoundary;

  static setOutputBoundary(outputBoundary) {
    if(outputBoundary.isOutputBoundaryInterface){
      this.#outputBoundary = outputBoundary;
    } else {
      throw new Error("not an OutputBoundary");
    }
  }

  /** GET API: Gets parsed transcript data matching with the querry from MongoDB.
   * @param transcriptDAO
   * @param {Object} req : contains additonal body passed to an API call
   * @param {Object} res : json object that is returned after making an API call
   * @param {Object} next
   */
  static async apiGetCleanedTranscripts(transcriptDAO, req, res, next) {
    try{
      await this.#inputBoundary.getFilteredTranscripts(this.#outputBoundary, req.query);
      res
        .status(this.#outputBoundary.getOutput().status)
        .json(this.#outputBoundary.getOutput().data);
    }catch(e){
      res.status(500).json({error: e.message});
    }

  }

  /** GET API: Gets trimmed transcript data matching with the querry from MongoDB.
   * Trimmed transcripts are composed of an object with the speaker followed by the text
   * @param textDAO
   * @param {Object} req : contains additonal body passed to an API call
   * @param {Object} res : json object that is returned after making an API call
   * @param {Object} next
   */
  static async apiGetTextTranscripts(textDAO, req, res, next) {
    try {
      await this.#inputBoundary.getFilteredTextTranscripts(this.#outputBoundary, textDAO, req.query);
      res
        .status(this.#outputBoundary.getOutput().status)
        .json(this.#outputBoundary.getOutput().data);
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  }

  /**
   * Adds all the transcripts saved under a project in Voiceflow in form of 'textTranscripts' to Mongo DB
   * @param textDAO
   * @param transcriptDAO
   * @param {Object} req : contains additional body passed to an API call
   * @param {Object} res : json object that is returned after making an API call
   * @param {Object} next
   */
  static async addTranscripts(textDAO, transcriptDAO, req, res, next) {
    try {
      await this.#inputBoundary.getVoiceFlowAPIData(textDAO, transcriptDAO)
      res.json({ status: "success" });
    } catch (e) {
      res.json({ status: "failure" });
    }

  }

  /**
   * Adds all the transcripts saved under a project in Voiceflow in form of 'textTranscripts' to Mongo DB
   * @param dao
   * @param {Object} req : contains additional body passed to an API call
   * @param {Object} res : json object that is returned after making an API call
   * @param {Object} next
   */
  //Come back to this function, deciding whether to add the dao as an if condition or just leave it
  static async flushDB(dao, req, res, next) {
    await this.#inputBoundary.flushCollection(dao, res)
  }

  /**
   * @param req
   * @return {Promise<void>}
   */
  static async storeVales(req){
    try {
      await this.#inputBoundary.saveKeys(req)
    } catch (e) {
      console.log("Error in saving keys")
    }

  }


}