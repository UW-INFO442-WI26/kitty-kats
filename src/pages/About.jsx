function About() {
  return (
    <div className="min-vh-100 bg-gradient-light py-5">
      <div className="container" style={{ maxWidth: '1100px' }}>
        <div className="bg-white rounded-4 p-4 shadow-sm border border-blush h-100" style={{ borderColor: 'var(--primary-pink)' }}>
          <div className="row align-items-center g-5">
            <div className="col-12 col-md-6">
              <div className="rounded-4 overflow-hidden">
                <img
                  src="/img/about-sex-ed.png"
                  alt="About sexual education"
                  className="w-100 h-auto"
                  style={{ objectFit: 'cover' }}
                />
              </div>
            </div>

            <div className="col-12 col-md-6">
              <h1 className="display-4 fw-bold text-deep-plum">Our Mission</h1>
              <p className="text-muted lh-lg">We primarily focused on addressing UN Sustainable Development Goal 4: Quality Education, with a strong connection to SDG 3: Good Health and Well-Being. </p>
              <p className="text-muted lh-lg">U.S. high school students often lack a strong understanding of sexual education due to the absence of a standardized curriculum. As a result, social stigma and widespread misconceptions continue to persist. Our project aims to address these gaps by providing an accessible and judgment-free platform that offers accurate and age-appropriate sexual health information. It presents this information through interactive features with fact-based feedback for an engaging learning experience. This works towards dismantling myths and empowering young people with the knowledge, confidence, and critical thinking skills needed to make informed decisions and support their long-term well-being.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default About;