import { BrowserRouter, Route, Routes } from "react-router-dom";
import App from "./App";
import Signup from "./component/Signup";
import Login from "./component/Login";
import Mypage from "./component/Mypage";
import FindId from "./component/FindId";
import FindPw from "./component/FindPw";
import ChangePw from "./component/ChangePw";
import Brand from "./component/Brand";
import SportTest from "./component/SportTest";
import MenuTest from "./component/MenuTest";
import Bmi from "./component/Bmi";
import Calorie from "./component/Calorie";
import Scheduler from "./component/Scheduler";
import Community from "./component/Community";
import CommunityPost from "./component/CommunityPost";
import Consulting from "./component/Consulting";
import TrainerMatch from "./component/TrainerMatch";
import Shop from "./component/Shop";
import ProductForSale from "./component/ProductForSale";
import PrivateRoute from "./component/PrivateRoute";
import AdminPage from "./component/AdminPage";
import OrderingPage from "./component/OrderingPage";
import CartOrderingPage from "./component/CartOrderingPage";
import ChatRoomA from "./component/ChatRoomA";
import ChatRoomB from "./component/ChatRoomB";
import ChatRoomC from "./component/ChatRoomC";

function AppRouter(){  
    const access = sessionStorage.getItem("token");

    return (
        <div>
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<App />} />
                    <Route path="/signup" element={<Signup />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/mypage" element={<Mypage />} />
                    <Route path="/findId" element={<FindId />} />
                    <Route path="/findPw" element={<FindPw />} />
                    <Route path="/changePw" element={<ChangePw />} />
                    <Route path="/brand" element={<Brand />} />
                    <Route path="/sportTest" element={<SportTest />} />
                    <Route path="/menuTest" element={<MenuTest />} />
                    <Route path="/bmi" element={<Bmi />} />
                    <Route path="/calorie" element={<Calorie />} />
                    <Route path="/scheduler" element={<PrivateRoute authenticated={access} component={<Scheduler />} />}></Route>
                    <Route path="/community" element={<Community />} />
                    <Route path="/communityPost" element={<CommunityPost />} />
                    <Route path="/consulting" element={<PrivateRoute authenticated={access} component={<Consulting />} />}></Route>
                    <Route path="/trainerMatch" element={<TrainerMatch />} />
                    <Route path="/productForSale" element={<ProductForSale />} />
                    <Route path="/adminPage" element={<AdminPage />} />
                    <Route path="/orderingPage" element={<OrderingPage />} />
                    <Route path="/cartOrderingPage" element={<CartOrderingPage />} />
                    <Route path="/chat1" element={<ChatRoomA />} />
                    <Route path="/chat2" element={<ChatRoomB />} />
                    <Route path="/chat3" element={<ChatRoomC />} />
                    <Route path="/shop" element={<Shop />} />
                </Routes>
            </BrowserRouter>

        </div>
    );
}

export default AppRouter;