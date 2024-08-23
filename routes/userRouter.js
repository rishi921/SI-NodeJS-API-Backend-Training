import express from 'express'
import { deleteUser, getUserById, getUsers, loginUser, registerUser, updateUser } from '../controllers/usersController.js'

const userRouter = express.Router()

userRouter.get('/', getUsers)
userRouter.get('/:id', getUserById)
userRouter.post('/register', registerUser);
userRouter.post('/login', loginUser)
userRouter.put('/:id', updateUser)
userRouter.delete('/:id', deleteUser)

export default userRouter;