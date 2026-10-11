import "../../styles/home-style.scss";
import {
    Activity,
    ArrowRight,
    CalendarDays,
    CheckCircle2,
    MessageSquare,
    Shield,
    Users,
    Zap,
} from "lucide-react";
import { Link } from "react-router-dom";

const Home = () => {
    const scrollToFeatures = () => {
        document.getElementById("home-features")?.scrollIntoView({
            behavior: "smooth",
        });
    };

    return (
        <div className="home__container">
            <section className="home__herosection">
                <div className="herobody">
                    <div className="herobodytag">
                        <Zap />
                        <span>Powered by AI</span>
                    </div>
                    <h1 className="herobodyheading">
                        Elevate your <span>fitness</span>
                        <br />
                        with Artificial Intelligence
                    </h1>
                    <p className="herobodycopy">
                        FitAI is your all-in-one companion. Track workouts, build
                        a weekly plan, start live sessions in one tap, and get
                        personalized AI coaching.
                    </p>
                    <div className="herobodybtn">
                        <Link to="/register">
                            <button className="herobodybtn1">
                                Start Your Journey <ArrowRight />
                            </button>
                        </Link>
                        <button type="button" className="herobodybtn2" onClick={scrollToFeatures}>
                            Explore Features
                        </button>
                    </div>
                </div>
            </section>
            <section id="home-features" className="home__featuresection">
                <div className="featurebody">
                    <div className="featureheading">
                        <h2>Everything you need to succeed</h2>
                        <p>
                            We combine traditional tracking with cutting-edge AI
                            to provide a holistic fitness experience.
                        </p>
                    </div>
                    <div className="featurecardset">
                        <div className="featurecard featurecard1">
                            <div className="featurecardicon featurecardicon1">
                                <Activity />
                            </div>
                            <h3>Smart Tracking</h3>
                            <p>
                                Log your workouts with ease. Visualize your
                                progress with interactive charts for calories,
                                duration, and intensity.
                            </p>
                        </div>
                        <div className="featurecard featurecard2">
                            <div className="featurecardicon featurecardicon2">
                                <MessageSquare />
                            </div>
                            <h3>AI Coach</h3>
                            <p>
                                Chat with our AI assistant for advice on form,
                                nutrition, and recovery as you train.
                            </p>
                        </div>
                        <div className="featurecard featurecard3">
                            <div className="featurecardicon featurecardicon3">
                                <CalendarDays />
                            </div>
                            <h3>Workout Plan</h3>
                            <p>
                                Build a weekly training plan from your exercise
                                library, then start any day as a live workout
                                in one click.
                            </p>
                        </div>
                    </div>
                </div>
            </section>
            <section className="home__socialproofsection">
                <div className="socialproofbody">
                    <div className="socialproofcopy">
                        <h3>
                            Join a community of <br />
                            <span>high performers</span>
                        </h3>
                        <div className="socialproofstat">
                            <div>
                                <CheckCircle2 />
                                <span>Data-driven insights</span>
                            </div>
                            <div>
                                <CheckCircle2 />
                                <span>Privacy focused</span>
                            </div>
                            <div>
                                <CheckCircle2 />
                                <span>Always-on availability</span>
                            </div>
                        </div>
                    </div>
                    <div className="socialproofcardset">
                        <div className="socialproofcard">
                            <Users className="card1" />
                            <div className="cardtext1">You</div>
                            <div className="cardtext2">Track your progress</div>
                        </div>
                        <div className="socialproofcard">
                            <Shield className="card2" />
                            <div className="cardtext1">100%</div>
                            <div className="cardtext2">Secure</div>
                        </div>
                    </div>
                </div>
            </section>
            <section className="home__footersection">
                <h2>Ready to transform?</h2>
                <Link to="/register">
                    <button type="button">Get Started for Free</button>
                </Link>
            </section>
        </div>
    );
};

export default Home;
