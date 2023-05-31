import { isLogin } from "../../utils/token";

export default (req, res) => {
  const t = isLogin();
  console.log("----", t);
  res.json({ name: "John Doe", rr: t });
};
