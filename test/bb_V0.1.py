#!/usr/bin/env python

import time
import unittest
import traceback, sys
from selenium import webdriver
from selenium.webdriver.common.keys import Keys
from selenium.common.exceptions import StaleElementReferenceException, NoSuchElementException, NoSuchWindowException
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

class PythonOrgSearch(unittest.TestCase):

    def setUp(self):
        self.driver = webdriver.Firefox()
        self.exc_type, self.exc_value, self.exc_traceback = sys.exc_info()
    
    def verifyPage(self,name):
    	driver = self.driver
    	time.sleep(.1)
    	if name == "Home":
				elem = driver.find_elements_by_tag_name("img")
				for e in elem:
				  if e.get_attribute("src") == "https://test.buildbotics.com/images/buildbotics_explore_learn_create.png":
						return e
				return False
		    
    def logMessage(self,msg):
      stack = traceback.extract_stack()
      i = len(stack)
      print '"' + msg + '" in {0} at line {1}, called by {2} at line {3}'.\
        format(stack[i-2][2],stack[i-2][1],stack[i-3][2],stack[i-3][1]) 

    def logError(self,msg):		
      stack = traceback.extract_stack()
      i = len(stack)
      print 'ERROR: "' + msg + \
        '" in {2} at line: {3} which was called by {0} at line: {1}'.\
        format(stack[i - 3][2],stack[i-3][1],stack[i-2][2],stack[i-2][1])
					
    def header(self,page):
        driver = self.driver
        driver.get(page)
        elem = self.verifyPage("Home")
        try:
          self.assertTrue(elem)
          self.logMessage(page + ' opened successfully')
        except:
          self.logError("Web page " + page + " failed to open")
          return
        elem.click();
        elem = self.verifyPage("Home")
        try:
          self.assertTrue(elem)
          self.logMessage("Correctly stayed on page when buildbotics logo was clicked")
        except:
          self.logError("Not on main page")
          return
        elem = driver.find_elements_by_class_name("header-nav")
        for e in elem:
          if e.text == "EXPLORE":
            e.click()
            menu = driver.find_element_by_id("explore-nav")
            try:
              self.assertTrue(menu.is_displayed())
              self.logMessage("EXPLORE menu dropped down correctly when clicked")
            except:
              self.logError("EXPLORE menu did not drop down when clicked")
              return
            menuitems = menu.find_elements_by_tag_name("li")
            for m in menuitems:
              if menu.is_displayed() is False: e.click()
              if m.find_element_by_tag_name("a").get_attribute("href") == "https://test.buildbotics.com/explore/creations":
                m.click()
                crumb = driver.find_element_by_class_name("breadcrumbs")
                try:
                  self.assertIn("creations",crumb.find_element_by_css_selector("a").get_attribute("href"))
                  self.logMessage("Creations page opened when Creations was clicked from EXPLORE menu")
                except:
                  self.logError("Creations page did not open when Creations was clicked from EXPLORE menu")
                  return
                driver.back()
                elem = self.verifyPage("Home")
                try:
                  self.assertTrue(elem)
                  self.logMessage(page + " correctly reopened when back button was clicked from Creations page")
                except:
                  self.logError("Back button in Creations failed to reopen " + page)
                  return
              if m.find_element_by_tag_name("a").get_attribute("href") == "https://test.buildbotics.com/explore/people":
                m.click()
                crumb = driver.find_element_by_class_name("breadcrumbs")
                try:
                  self.assertIn("people",crumb.find_element_by_css_selector("a").get_attribute("href"))
                  self.logMessage("People page opened when People was clicked from EXPLORE menu")
                except:
                  self.logError("People page did not open when People was clicked from EXPLORE menu")
                  return
                driver.back()
                elem = self.verifyPage("Home")
                try:
                  self.assertTrue(elem)
                  self.logMessage(page + " correctly reopened when back button was clicked from People page")
                except:
                  self.logError("Back button in People failed to reopen " + page)
                  return
              if m.find_element_by_tag_name("a").get_attribute("href") == "https://test.buildbotics.com/explore/tags":
                m.click()
                crumb = driver.find_element_by_class_name("breadcrumbs")
                try:
                  self.assertIn("tags",crumb.find_element_by_css_selector("a").get_attribute("href"))
                  self.logMessage("Tags page opened when Tags was clicked from EXPLORE menu")
                except:
                  self.logError("Tags page did not open when Tags was clicked from EXPLORE menu")
                  return
                driver.back()
                elem = self.verifyPage("Home")
                try:
                  self.assertTrue(elem)
                  self.logMessage(page + " correctly reopened when back button was clicked from Tags page")
                except:
                  self.logError("Back button in Tags failed to reopen " + page)
                  return
              if m.find_element_by_tag_name("a").get_attribute("href") == "https://test.buildbotics.com/explore/activity":
                m.click()
                crumb = driver.find_element_by_class_name("breadcrumbs")
                try:
                  self.assertIn("activity",crumb.find_element_by_css_selector("a").get_attribute("href"))
                  self.logMessage("Activity page opened when ASctivity was clicked from EXPLORE menu")
                except:
                  self.logError("Activity page did not open when Activity was clicked from EXPLORE menu")
                  return
                driver.back()
                elem = self.verifyPage("Home")
                try:
                  self.assertTrue(elem)
                  self.logMessage(page + " correctly reopened when back button was clicked from Activity page")
                except:
                  self.logError("Back button in Activity failed to reopen " + page)
                  return
          elif e.text == "LEARN":
        	  e.click()
        	  crumb = driver.find_element_by_class_name("breadcrumbs")
        	  try:
        	    self.assertIn("learn", crumb.find_element_by_css_selector("a").get_attribute("href"))
        	    self.logMessage("Learn page opened when LEARN was clicked")
        	  except:
        	    self.logError("Learn page did not open when LEARN was clicked")
        	    return
        	  driver.back()
        	  elem = self.verifyPage("Home")
        	  try:
        	    self.assertTrue(elem)
        	    self.logMessage(page + " correctly reopened when back button clicked from Learn page")
        	  except:
        	    self.logError("Back button in Learn page failed to reopen " + page)
        	    return;
          elif e.text == "CREATE":
        	  e.click()
        	  crumb = driver.find_element_by_class_name("breadcrumbs")
        	  try:
        	    self.assertIn("create",crumb.find_element_by_css_selector("a").get_attribute("href"))
        	    self.logMessage("Create page opened when CREATE was clicked")
        	  except:
        	    self.logError("Create page did not open when CREATE was clicked")
        	    return
        	  driver.back()
        	  elem = self.verifyPage("Home")
        	  try:
        	    self.assertTrue(elem)
        	    self.logMessage(page + " reopened when back button clicked from Create page")
        	  except:
        	    self.logError("Back button in Create page failed to reopen " + page)
        	    return
          elif e.text == "Login or Register":
        	  e.click()
        	  crumb = driver.find_element_by_class_name("header-content")
        	  try:
        	    self.assertEquals("Login or Register with:",crumb.text)
        	    self.logMessage("Clicking Login or Register successfully opened Login or Register page")
        	  except:
        	    self.logError("Login or Register page did not open when Login or Register was clicked")
        	    return
        	  driver.back()
        	  elem = self.verifyPage("Home")
        	  try:
        	    self.assertTrue(elem)
        	    self.logMessage(page + " reopened when back button clicked from Login or Register page")
        	  except:
        	    self.logError("Back button in Login or Register page failed to reopen " + page)
        	    return
          else:
            s = e.get_attribute("href")
            if "creations" not in s and "people" not in s and "tags" not in s and "activity" not in s:
              if e.is_displayed() is True:
                self.logMessage("WARNING: untested functionality (" + e.get_attribute('outerHTML') + ")")
        elem = driver.find_elements_by_class_name("panel-heading")
        for e in elem:
          print e.get_attribute("outerHTML")
          print e.get_attribute("innerHTML")
        for e in elem:
          s = ""
          try:
            if e.text == "Explore":
              s = s + "Explore"
              try:
                e.click()
                wait = WebDriverWait(driver,3)
                wait.until(EC.text_to_be_present_in_element(driver.find_element(By.CLASS_NAME,"breadcrumbs"),"explore") or
                           EC.text_to_be_present_in_element(driver.find_element(By.CLASS_NAME,"breadcrumbs"),"Sorry, page not found"))
                if driver.find_element_by_class_name("breadcrumbs").text == "Sorry, page not found":
                  s = s + ": Sorry, page not found"
              except:
                self.logError(s)
                driver.back()
            elif e.text == "Create":
              print "Create"
            elif e.text == "Learn":
              print "Learn"
            else:
              self.logError(e.text + ": Unknown Functionalitiy")
          except:
            self.logError("STALE LINK")


 
    
    def test_home(self):
      self.header("https://test.buildbotics.com")

    def tearDown(self):
        self.driver.close()

if __name__ == "__main__":
    unittest.main()
