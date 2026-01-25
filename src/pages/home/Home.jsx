import React, { useEffect, useState } from "react";
import AddWorkoutComponent from "../../components/AddWorkoutComponent";
import {
    Activity,
    ArrowRight,
    CheckCircle2,
    ImageIcon,
    MessageSquare,
    Shield,
    Users,
    Zap,
} from "lucide-react";

const Home = () => {
    return (
        <div className="home__container">
            <section className="home__herosection">
                <div className="herobody">
                    <div className="herobodytag">
                        <Zap />
                        <span>Powered by GEMINI</span>
                    </div>
                    <h1 className="herobodyheading">
                        Elevate your <span>fitness</span>
                        <br />
                        with Artificial Intelligence
                    </h1>
                    <p className="herobodycopy">
                        FitAI is your all-in-one companion. Track workouts, get
                        personalized AI coaching, and visualize your progress
                        with next-gen image editing tools.
                    </p>
                    <div className="herobodybtn">
                        <button className="herobodybtn1">
                            Start Your Journey <ArrowRight />
                        </button>
                        <button className="herobodybtn2">
                            Explore Features
                        </button>
                    </div>
                </div>
            </section>
            <section className="home__featuresection">
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
                                Chat with our advanced AI assistant powered by
                                Gemini. Get instant advice on form, nutrition,
                                and recovery.
                            </p>
                        </div>
                        <div className="featurecard featurecard3">
                            <div className="featurecardicon featurecardicon3">
                                <ImageIcon />
                            </div>
                            <h3>AI Studio</h3>
                            <p>
                                Transform your workout photos using the "Nano
                                Banana" image model. Edit backgrounds, add
                                effects, and style your gym selfies.
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
                            <div className="cardtext1">10k+</div>
                            <div className="cardtext2">Active Users</div>
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
                <button>Get Started for Free</button>
            </section>
        </div>
    );
};

export default Home;
