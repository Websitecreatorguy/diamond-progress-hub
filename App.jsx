import { useState } from 'react'
import './styles.css'

const services = [
  ['Business Websites','Modern websites designed specifically around your business.'],
  ['Restaurant Websites','Clean, visual sites for restaurants, cafés, dessert shops, and food businesses.'],
  ['Website Redesigns','Turn an outdated site into something modern and professional.'],
  ['Landing Pages','Focused pages for products, services, promotions, and new businesses.'],
  ['Sports Websites','Websites for teams, coaches, training programs, and sports organizations.'],
  ['Custom Projects','Have something different in mind? Let’s build it.'],
]

function App() {
  const [open, setOpen] = useState(false)

  return (
    <>
      <header className="siteHeader">
        <div className="container navWrap">
          <a className="brand" href="#home">
            <span className="brandIcon">◇</span>
            <span>Diamond<span className="accent">Development</span></span>
          </a>
          <button className="menuBtn" onClick={() => setOpen(!open)} aria-label="Toggle menu">☰</button>
          <nav className={open ? 'open' : ''}>
            {['Home','Services','Work','Pricing','About'].map((x) => (
              <a key={x} href={'#'+x.toLowerCase()} onClick={()=>setOpen(false)}>{x}</a>
            ))}
            <a className="navCta" href="#contact" onClick={()=>setOpen(false)}>Get a Website</a>
          </nav>
        </div>
      </header>

      <main>
        <section className="hero" id="home">
          <div className="gridBg" />
          <div className="container heroInner">
            <div className="eyebrow"><span className="dot"/> Now accepting new projects</div>
            <h1>Websites That Make Your<br/>Business Look <span className="gradientText">Legit.</span></h1>
            <p className="heroSub">I design modern, professional websites for local businesses — without the traditional agency price tag.</p>
            <div className="heroActions">
              <a className="btn dark" href="#contact">Get Your Website <span>→</span></a>
              <a className="btn light" href="#work">See My Work</a>
            </div>
            <div className="heroMeta">
              <span><strong>Starting at $45</strong></span><span>•</span>
              <span>▣ Mobile Friendly</span><span>•</span>
              <span>▤ Built for Your Business</span>
            </div>

            <div className="browserCard">
              <div className="browserTop">
                <div className="dots"><i/><i/><i/></div>
                <div className="addressBar"/>
              </div>
              <div className="browserBody">
                <div className="mockLeft">
                  <span className="mockPill"/>
                  <span className="mockLine large"/>
                  <span className="mockLine"/>
                  <span className="mockLine small"/>
                  <div className="mockButtons"><span/><span/></div>
                </div>
                <div className="mockRight">
                  <div className="mockCard"/>
                  <div className="mockCard smallCard"/>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="services" className="section">
          <div className="container">
            <div className="kicker">Services</div>
            <h2>Everything Your Business Needs Online</h2>
            <p className="lead">Simple, polished websites made for real local businesses.</p>
            <div className="serviceGrid">
              {services.map(([title, desc], i) => (
                <article className="serviceCard" key={title}>
                  <div className="icon">{['◫','◉','↻','↗','⚾','✦'][i]}</div>
                  <h3>{title}</h3><p>{desc}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="work" className="section muted">
          <div className="container">
            <div className="kicker">Work</div>
            <h2>My Work</h2>
            <p className="lead">Real client projects will appear here as Diamond Development grows.</p>
            <div className="workGrid">
              {[1,2,3].map((n) => (
                <article className="workCard" key={n}>
                  <div className={'workPreview p'+n}><span>Project Coming Soon</span></div>
                  <div className="workContent">
                    <span className="tag">Future Project</span>
                    <h3>Project Coming Soon</h3>
                    <p>This space is ready for a real completed client website.</p>
                    <button disabled>View Website</button>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="section">
          <div className="container">
            <div className="kicker">Process</div>
            <h2>From Idea to Website in 4 Steps</h2>
            <div className="steps">
              {[
                ['01','Tell Me About Your Business','Send your business info, photos, services, menu, social media, and ideas.'],
                ['02','I Build It','I create a website designed specifically around your business.'],
                ['03','You Review It','See the website and request changes before anything is finalized.'],
                ['04','Go Live','Once everything looks right, the website can be connected to your domain.']
              ].map(([num,title,desc])=>(
                <div className="step" key={num}><span>{num}</span><h3>{title}</h3><p>{desc}</p></div>
              ))}
            </div>
          </div>
        </section>

        <section id="pricing" className="section pricing">
          <div className="container pricingWrap">
            <div>
              <div className="kicker">Pricing</div>
              <h2>Professional Doesn’t Have to Mean Expensive.</h2>
              <p className="lead">A strong online presence without a huge agency bill.</p>
            </div>
            <article className="priceCard">
              <span className="priceLabel">Starter Website</span>
              <div className="price"><small>Starting at</small><strong>$45</strong></div>
              <ul>
                <li>✓ Custom website design</li><li>✓ Mobile-friendly layout</li>
                <li>✓ Business information</li><li>✓ Services or menu section</li>
                <li>✓ Contact section</li><li>✓ Social links</li>
                <li>✓ Google Maps integration when needed</li><li>✓ Basic revisions</li>
              </ul>
              <a className="btn white full" href="#contact">Start a Project →</a>
              <p className="tiny">Need something more advanced? Contact me for a custom quote.</p>
            </article>
          </div>
        </section>

        <section id="about" className="section darkSection">
          <div className="container aboutGrid">
            <div><div className="kicker lightKicker">About</div><h2>Small Business Websites Without the Agency Hassle</h2></div>
            <p>Diamond Development creates clean, modern websites for small and local businesses. The goal is simple: make getting a professional online presence easier and more affordable.</p>
          </div>
        </section>

        <section id="contact" className="section">
          <div className="container">
            <div className="contactHead"><div className="kicker">Contact</div><h2>Let’s Build Your Website.</h2><p>Tell me about your business and what you’re looking for.</p></div>
            <div className="contactGrid">
              <div className="contactInfo">
                <a href="mailto:yoochristian11@gmail.com"><span>Primary Email</span><strong>yoochristian11@gmail.com</strong></a>
                <a href="mailto:christianyoo21@gmail.com"><span>Second Email</span><strong>christianyoo21@gmail.com</strong></a>
                <a href="tel:+13107077941"><span>Phone / Text</span><strong>310-707-7941</strong></a>
              </div>
              <form className="contactForm" action="mailto:yoochristian11@gmail.com" method="post" encType="text/plain">
                <div className="row"><label>Name<input name="Name" required/></label><label>Business Name<input name="Business Name"/></label></div>
                <div className="row"><label>Email<input type="email" name="Email" required/></label><label>Phone<input type="tel" name="Phone"/></label></div>
                <label>Current Website<input type="url" name="Current Website" placeholder="https://"/></label>
                <label>Business Type<input name="Business Type" placeholder="Restaurant, auto shop, sports team..."/></label>
                <label>Project Details<textarea name="Project Details" rows="6" placeholder="Tell me what kind of website you need..."/></label>
                <button className="btn dark full" type="submit">Send Project Request →</button>
                <p className="formNote">This opens your email app with the project request.</p>
              </form>
            </div>
          </div>
        </section>
      </main>

      <footer>
        <div className="container footerWrap">
          <div>
            <a className="brand" href="#home"><span className="brandIcon">◇</span><span>Diamond<span className="accent">Development</span></span></a>
            <p>Modern websites for local businesses.</p>
          </div>
          <div className="footerLinks">
            <a href="#home">Home</a><a href="#services">Services</a><a href="#work">Work</a><a href="#pricing">Pricing</a><a href="#contact">Contact</a>
          </div>
        </div>
        <div className="container copyright">© {new Date().getFullYear()} Diamond Development. All rights reserved.</div>
      </footer>
    </>
  )
}

export default App
