const username = process.env.username
const password = process.env.password

const sleep = duration => new Promise(resolve => setTimeout(() => resolve(), duration))

const loginWith = async (username, password) => {
  try {
    const navigateToLoginBtn = await element(by.id('navigate-login-btn'))
    await navigateToLoginBtn.tap()

    const usernameInput = await element(by.id('username-input'))
    const passwordInput = await element(by.id('password-input'))

    await usernameInput.tap()
    await usernameInput.typeText(username)
    await passwordInput.typeText(password)

    const loginBtn = await element(by.id('login-btn'))

    await loginBtn.tap()
    await loginBtn.tap()

    const errorMessage = await element(by.text('Invalid username and/or password'))

    return { errorMessage, usernameInput, passwordInput }
  } catch (e) {
    console.log('A sign out has not been done, which made the `navigate-login-btn` not found')
  }
}

const loginWithWrongCredentials = async () => await loginWith('alex339', '9sdfhsakjf')
const loginWithRightCredentials = async () => await loginWith(username, password)

const goToLibrary = async () => {
  const libraryBtn = await element(by.id('navigation-btn-Library'))
  await libraryBtn.tap()
}

const goToExplore = async () => {
  const exploreBtn = await element(by.id('navigation-btn-Explore'))
  await exploreBtn.tap()
}

const signOut = async () => {
  await goToLibrary()

  const settingsBtn = await element(by.id('settings-btn'))
  await settingsBtn.tap()

  const signOutBtn = await element(by.id('sign-out-btn'))
  await signOutBtn.tap()
}

const continueAsGuest = async () => {
  const continueAsGuestBtn = await element(by.id('continue-as-guest'))
  await continueAsGuestBtn.tap()
}

const searchForMovie = async movieTitle => {
  const searchMoviesInput = await element(by.id('search-input-input'))
  await searchMoviesInput.tap()
  await searchMoviesInput.clearText()
  await searchMoviesInput.typeText(movieTitle)
}

const assertMovieItems = async (moviesTitles = []) => {
  for (let i = 0; i < moviesTitles.length; i++) {
    const moviesItem = await element(by.text(moviesTitles[i]))
    await expect(moviesItem).toBeVisible()
  }
}

const goBack = async () => {
  const goBackBtn = await element(by.id('go-back-btn'))
  goBackBtn.tap()
}

const goToWatchListMovies = async () => {
  const watchListBtn = await element(by.id('my-watchlist'))
  await watchListBtn.tap()
}

const goToFavoriteMovies = async () => {
  const favoriteMoviesBtn = await element(by.id('my-favorite-movies'))
  await favoriteMoviesBtn.tap()
}

const clickFavoriteButton = async () => {
  const addToWatchListBtn = await element(by.id('add-to-favorite-btn'))
  await addToWatchListBtn.tap()
}

const clickWatchListButton = async () => {
  const addToWatchListBtn = await element(by.id('add-to-watch-list-btn'))
  await addToWatchListBtn.tap()
}

const removeTestMoviesFromLists = async () => {
  try {
    await loginWithRightCredentials()

    await goToLibrary()

    await goToWatchListMovies()

    const movieItemInWatchList = await element(
      by.text('Crazy Rich Asians').withAncestor(by.id('watch-list')),
    )

    await movieItemInWatchList.tap()

    await clickWatchListButton()

    await goToLibrary()

    await goToFavoriteMovies()

    const movieItemInFavorites = await element(
      by.text('Avengers: Endgame').withAncestor(by.id('favorite-list')),
    )

    await movieItemInFavorites.tap()

    await clickFavoriteButton()
  } catch (e) {}
  await signOut()
}

describe('Project Test Suite', () => {
  beforeAll(async () => {
    await removeTestMoviesFromLists()
  })

  beforeEach(async () => {
    await device.reloadReactNative()
  })

  afterEach(async () => {
    try {
      await signOut()
    } catch (e) {}
  })

  it('should disallow login with wrong credentials', async () => {
    const { errorMessage, usernameInput, passwordInput } = await loginWithWrongCredentials()

    await expect(errorMessage).toBeVisible()
    await expect(usernameInput).toBeVisible()
    await expect(passwordInput).toBeVisible()
  })

  it('should login with right credentials', async () => {
    await loginWithRightCredentials()

    await goToLibrary()

    const watchListBtn = element(by.id('my-watchlist'))
    const favoriteMoviesBtn = element(by.id('my-favorite-movies'))

    await expect(watchListBtn).toBeVisible()
    await expect(favoriteMoviesBtn).toBeVisible()
  })

  it('should kick user out when sign out is clicked', async () => {
    await loginWithRightCredentials()

    await goToLibrary()

    await signOut()

    const loginBtn = await element(by.id('navigate-login-btn'))

    await expect(loginBtn).toBeVisible()
  })

  it('should allow guest in for Browse only', async () => {
    await continueAsGuest()

    await goToLibrary()

    const watchListBtn = element(by.id('my-watchlist'))
    const favoriteMoviesBtn = element(by.id('my-favorite-movies'))

    await expect(watchListBtn).toBeNotVisible()
    await expect(favoriteMoviesBtn).toBeNotVisible()

    await goToExplore()

    const moviesSwipingView = element(by.id('movies-swiping-view'))

    await expect(moviesSwipingView).toBeNotVisible()
  })

  it('should fetch and render the searches properly', async () => {
    await loginWithRightCredentials()

    const searches = [
      { query: 'xmen', results: ['X-Men: Apocalypse', 'X-Men: Days of Future Past'] },
      { query: 'avengers', results: ['Avengers: Endgame', 'Avengers: Age of Ultron'] },
      { query: 'wolverine', results: ['Logan', 'The Wolverine'] },
    ]

    for (let i = 0; i < searches.length; i++) {
      const currentSearch = searches[i]

      await searchForMovie(currentSearch.query)
      await assertMovieItems(currentSearch.results)
    }
  })

  it('should add to favorite', async () => {
    await loginWithRightCredentials()

    await searchForMovie('avengers')
    await element(by.text('Avengers: Endgame')).tap()

    await clickFavoriteButton()

    await goBack()

    await goToLibrary()

    await goToFavoriteMovies()

    await sleep(3000)

    var movieItemInFavorites = await element(
      by.id('favorite-list').withDescendant(by.text('Avengers: Endgame')),
    )

    await expect(movieItemInFavorites).toBeVisible()
  })

  it('should add to watchlist', async () => {
    await loginWithRightCredentials()

    await searchForMovie('crazy rich')
    await element(by.text('Crazy Rich Asians')).tap()

    await clickWatchListButton()

    await goBack()

    await goToLibrary()

    await goToWatchListMovies()

    await sleep(3000)

    const movieItemInFavorites = await element(
      by.id('watch-list').withDescendant(by.text('Crazy Rich Asians')),
    )

    await expect(movieItemInFavorites).toBeVisible()
  })

  it('should show all lists more is clicked', async () => {
    await loginWithRightCredentials()

    const trendingDailyMoreBtn = await element(by.id('trending-daily-more'))
    await trendingDailyMoreBtn.tap()

    await goBack()
    await sleep(300)

    const trendingWeeklyMoreBtn = await element(by.id('trending-weekly-more'))
    await trendingWeeklyMoreBtn.tap()

    await goBack()
    await sleep(300)

    const popularMoreBtn = await element(by.id('popular-more'))
    await popularMoreBtn.tap()

    await goBack()
    await sleep(300)

    const browseSectionsView = await element(by.id('browse-sections-view'))
    await browseSectionsView.scrollTo('bottom')

    const topRatedMoreBtn = await element(by.id('top-rated-more'))
    await topRatedMoreBtn.tap()
  })
})
