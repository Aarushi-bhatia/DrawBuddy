import { Router } from "express"
import authMiddleware from "../middlewares/authMiddleware.js"
import { roomControler } from "../controllers/roomController.js"
import { createRoomSchema } from "../schema/roomSchema.js"
import { validateInput } from "../middlewares/validateInput.js"
const router = Router()

router.post(
  "/create/",
  validateInput(createRoomSchema, "body"),
  authMiddleware,
  roomControler.create
)
router.post("/join/:slug", authMiddleware, roomControler.join)
router.get("/:roomId", authMiddleware, roomControler.getChats)
router.delete("/:roomId", authMiddleware, roomControler.delete)
export default router
