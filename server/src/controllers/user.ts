import User from "../models/user";

const GetAllUsers = async (_: any, res: any) => {
  try {
    const users = await User.find();
    return res.status.send(users);
  } catch (e: any) {
    return res.status(400).send({ message: "error" });
  }
};


const SaveUser = async (req: any, res: any) => {
  try {

    const { email, userName } = req.body;
    let user = await User.findOne({email})

    // if user does not exist, create new reocrd
    // else update username
    if(!user){
      user = await User.create({ email, userName });
    } else {
      await User.updateOne({email},{userName})
      return res.status(201).send({ message: "success", user });
    }

    return res.status(201).send({ message: "success", user });
  } catch (e: any) {
    return res.status(400).send({ message: "error" });
  }
};

export { SaveUser, GetAllUsers };
