#!/usr/bin/env python
import sys, time, unittest, traceback, json
from selenium import webdriver
from gi.repository import Gtk, GdkPixbuf

class TestRunner(unittest.TestCase):

    def __init__(self):    
      self.builder = Gtk.Builder()
      self.builder.add_from_file("TR1.xml")        
      self.window = self.builder.get_object("applicationwindow1")
      self.builder.connect_signals(self)
      self.stepList = self.builder.get_object("stepList")
      self.stepStore  = Gtk.TreeStore(GdkPixbuf.Pixbuf,int, bool, GdkPixbuf.Pixbuf, str, str, str)
      self.stepList.set_model(self.stepStore)
      self.textRenderer = Gtk.CellRendererText()
      self.altTextRender = Gtk.CellRendererText()
      self.toggleRendererSkip = Gtk.CellRendererToggle()
      self.dataScript = []
      
      self.iconRenderer = Gtk.CellRendererPixbuf()
      icontheme = Gtk.IconTheme.get_default()
      self.iconPass = icontheme.load_icon(Gtk.STOCK_YES,13,0)
      self.iconNotTested = icontheme.load_icon(Gtk.STOCK_CDROM,13,0)
      self.iconFail = icontheme.load_icon(Gtk.STOCK_NO,13,0)
      self.iconStop = icontheme.load_icon(Gtk.STOCK_STOP,13,0)     
      self.toggleRendererSkip.connect("toggled", self.on_skip_clicked,self.stepStore)
      
      column0 = Gtk.TreeViewColumn("Break",self.iconRenderer, pixbuf = 0)
      column1 = Gtk.TreeViewColumn("Step", self.textRenderer,text = 1)
      column2 = Gtk.TreeViewColumn("Skip", self.toggleRendererSkip,active = 2)
      column3 = Gtk.TreeViewColumn("Result",self.iconRenderer, pixbuf = 3)
      column4 = Gtk.TreeViewColumn("Type", self.textRenderer,text = 4)
      column5 = Gtk.TreeViewColumn("Criteria", self.textRenderer,text = 5)
      column6 = Gtk.TreeViewColumn("Value", self.textRenderer,text = 6)
      self.stepList.append_column(column0)
      self.stepList.append_column(column1)
      self.stepList.append_column(column2)
      self.stepList.append_column(column3)
      self.stepList.append_column(column4)
      self.stepList.append_column(column5)
      self.stepList.append_column(column6)
      self.paused = False
      
      self.messageLog = self.builder.get_object("messagelog")
      self.messageBuffer = self.messageLog.get_buffer()
            
      self.viewStepDialog = self.builder.get_object("StepViewDialog")
      self.viewStepTypeLabel = self.builder.get_object("StepViewTypeLabel")
      self.viewStepCriteriaLabel = self.builder.get_object("StepViewCriteriaLabel")
      self.viewStepValueLabel = self.builder.get_object("StepViewValueLabel")
      
      self.changeStepDialog = self.builder.get_object("StepChangeDialog")
      self.changeStepTypeComboBox = self.builder.get_object("StepChangeTypeComboBox")
      self.changeStepCriteriaComboBox = self.builder.get_object("StepChangeCriteriaComboBox")
      self.changeStepValueEntry = self.builder.get_object("StepChangeValueEntry")
      self.changeStepErrorEntry = self.builder.get_object("StepChangeErrorEntry")
      self.changeStepCommentEntry = self.builder.get_object("StepChangeCommentEntry")
      self.actionList = ["testName","openSite","find","findSub","assert","click",\
               "wait","back","refresh","goto"]
      self.criteriaList = ["None","id","Tag","class","link text","text","src","is_displayed"]
      
      
      self.viewStepErrorLabel = self.builder.get_object("StepViewErrorLabel")
      self.viewStepCommentsLabel = self.builder.get_object("StepViewCommentsLabel")
      
      self.messageDialog = self.builder.get_object("MessageDialog")
      self.messageDialogLabel = self.builder.get_object("MessageDialogLabel")
      
      self.confirmDialog = self.builder.get_object("AreYouSureDialog")
      self.confirmDialogLabel = self.builder.get_object("ConfirmDialogLabel")
      
      self.setUp()
      
    def loadStore(self):
      self.stepStore.clear()
      i = 1
      while i <= len(self.dataScript[0]):
        arg1 = None
        arg2 = None
        arg3 = None 
        if self.dataScript[0][i-1].get("type") : arg1 = self.dataScript[0][i-1]["type"]
        if self.dataScript[0][i-1].get("criteria") : arg2 = self.dataScript[0][i-1]["criteria"]
        if self.dataScript[0][i-1].get("value") : arg3 = self.dataScript[0][i-1]["value"]
        self.stepStore.append(None,[None,i,0,self.iconNotTested,arg1,arg2,arg3])
        i = i + 1
      return i - 1

    def on_open_click(self, menuitem, data=None):
      fcd = Gtk.FileChooserDialog("Open...",
                      None,
                      Gtk.FileChooserAction.OPEN,
                      (Gtk.STOCK_CANCEL, Gtk.ResponseType.CANCEL,Gtk.STOCK_OPEN, Gtk.ResponseType.OK))
      response = fcd.run()
      if response == Gtk.ResponseType.OK:
        self.sourceFile = fcd.get_filename()
      fcd.destroy()
      json_data = open(self.sourceFile)
      self.dataScript = json.load(json_data)
      i = self.loadStore()
      self.stepList.set_cursor(0)
      self.logMessage("File: {0} opened.\n{1} steps registered.".format(self.sourceFile, i-1))
      return          

    def on_InsertStepBefore_clicked(self,widget,data=None):
      return self.newStep("before")
      
    def on_AddStepAfter_clicked(self,widget,data=None):
      return self.newStep("after")
      
    def on_DeleteStep_clicked(self,widget,data=None):
      selection = self.stepList.get_selection()
      it = selection.get_selected()[1]
      if it == None: return        
      stepNumber = self.stepStore.get_path(it)[0]
      message = "Deleting step number {0}\n\nPlease click Apply to confirm or\nCancel to cancel"
      self.confirmDialogLabel.set_text(message.format(stepNumber + 1))
      result = self.confirmDialog.run()
      self.confirmDialog.hide()
      if result == 0: return
      self.dataScript[0].pop(stepNumber)
      i = self.loadStore()
      if i >= stepNumber: self.stepList.set_cursor(stepNumber)
      else: self.stepList.set_cursor(i)
      self.logMessage("Step {0} was deleted.",format(stepNumber + 1))
         
    def newStep(self,when):
      self.changeStepTypeComboBox.set_active(0)
      self.changeStepCriteriaComboBox.set_active(0)
      self.changeStepValueEntry.set_text("")
      self.changeStepErrorEntry.set_text("")
      self.changeStepCommentEntry.set_text("")
      result = self.changeStepDialog.run()
      self.changeStepDialog.hide()
      if result == 0: return
      
      step = {}
      step["type"] = self.actionList[self.changeStepTypeComboBox.get_active()]
      index = self.changeStepCriteriaComboBox.get_active()
      if index != 0: step["criteria"] = self.criteriaList[index]
      value = self.changeStepValueEntry.get_text()
      if len(value) > 0: step["value"] = value
      error = self.changeStepErrorEntry.get_text()
      if len(error) > 0: step["errMsg"] = error
      comment = self.changeStepCommentEntry.get_text()
      if len(comment) > 0: step["COMMENT"] = comment
      
      if len(self.dataScript) == 0:
        self.dataScript.append([step])
        self.loadStore()
        self.stepList.set_cursor(0)
        self.logMessage("Step 1 added.")
        return
        
      selection = self.stepList.get_selection()
      it = selection.get_selected()[1]        
      stepNumber = self.stepStore.get_path(it)[0]
      if (when == "before"):
        self.dataScript[0].insert(stepNumber,step)
      else:
        stepNumber += 1
        self.dataScript[0].insert(stepNumber,step)
      self.loadStore()
      self.logMessage("New step added {0} step number {1}".format(when,stepNumber))
      self.stepList.set_cursor(stepNumber)
     
      
    def on_EditStep_clicked(self,widget,data=None):
      selection = self.stepList.get_selection()
      if selection.count_selected_rows() != 1:
        self.messageDialogLabel.set_text("No step is selected")
        self.messageDialog.run()
        self.messageDialog.hide()
        return False

      it = selection.get_selected()[1]
      row = self.stepStore.get_path(it)[0]
      step = self.dataScript[0][row]
      index = self.actionList.index(step["type"])
      self.changeStepTypeComboBox.set_active(index)
      if step.get("criteria"):
        index = self.criteriaList.index(step["criteria"])
        self.changeStepCriteriaComboBox.set_active(index)
      else: self.changeStepCriteriaComboBox.set_active(0)
      if step.get("value"):
        self.changeStepValueEntry.set_text(step["value"])
      else: self.changeStepValueEntry.set_text("")
      if step.get("errMsg"):
        self.changeStepErrorEntry.set_text(step["errMsg"])
      else: self.changeStepErrorEntry.set_text("")
      if step.get("COMMENT"):
        self.changeStepCommentEntry.set_text(step["COMMENT"])
      else: self.changeStepCommentEntry.set_text("")
          
      result = self.changeStepDialog.run()
      self.changeStepDialog.hide()
      if result == 1:
        sType = self.actionList[self.changeStepTypeComboBox.get_active()]
        self.stepStore.set_value(it,4,sType)
        self.dataScript[0][row]["type"] = sType
        
        criteria = self.criteriaList[self.changeStepCriteriaComboBox.get_active()]
        if criteria == "None": 
          if step.get("criteria"): step.dataScript[0][row].pop("criteria")
          self.stepStore.set_value(it,5,"")
        else:
          self.stepStore.set_value(it,5,criteria)
          self.dataScript[0][row]["criteria"] = criteria
          
        value = self.changeStepValueEntry.get_text()
        if value == "":
          if step.get("value"):
            self.stepStore.set_value(it,6,"")
            self.dataScript[0][row].pop("value")
        else:
          self.stepStore.set_value(it,6,value)
          self.dataScript[0][row]["value"] = value
        
        error = self.changeStepErrorEntry.get_text()
        if error == "":
          if step.get("errMsg"):
            self.dataScript[0][row].pop("errMsg")
        else:
          self.dataScript[0][row]["errMsg"] = error

        comment = self.changeStepCommentEntry.get_text()
        if comment == "":
          if step.get("COMMENT"):
            self.dataScript[0][row].pop("COMMENT")
        else:
          self.dataScript[0][row]["COMMENT"] = comment
       
    def on_ViewStep_clicked(self, widget, data=None):
      selection = self.stepList.get_selection()
      if selection.count_selected_rows() != 1:
        self.messageDialogLabel.set_text("No step is selected")
        self.messageDialog.run()
        self.messageDialog.hide()
        return False        
      it = selection.get_selected()[1]
      row = self.stepStore.get_path(it)[0]
      step = self.dataScript[0][row]
      self.viewStepTypeLabel.set_text(step["type"])
      if step.get("criteria"):
        self.viewStepCriteriaLabel.set_text(self.dataScript[0][row]["criteria"])
      if step.get("value"):
        self.viewStepValueLabel.set_text(self.dataScript[0][row]["value"])
      if step.get("errMsg"):
        self.viewStepErrorLabel.set_text(self.dataScript[0][row]["errMsg"])
      if step.get("COMMENT"):
        self.viewStepCommentsLabel.set_text(self.dataScript[0][row]["COMMENT"])
      
      buttonVal = self.viewStepDialog.run()
      self.viewStepDialog.hide()
        
    def on_stepList_query_tooltip(self, widget, x, y, keyboard_tip, tooltip):
      if not widget.get_tooltip_context(x, y, keyboard_tip)[0]: return False
      valid,x,y,model,path,it = widget.get_tooltip_context(x, y, keyboard_tip)

      step = self.dataScript[0][path[0]]
      text = "type: " + step["type"]
      if step.get("criteria"): text = text + "\ncriteria: " + step["criteria"]
      if step.get("value"): text = text + "\nvalue: " + step["value"]
      for key, value in self.dataScript[0][path[0]].iteritems():
        if key not in ["type", "criteria", "value"]: text = text + "\n" + key + ": " + value      
        
      tooltip.set_text(text)
      widget.set_tooltip_row(tooltip,path)
      return True
      
    def on_stepList_button_press_event(self, widget, event, data=None):
      if not widget.get_path_at_pos(event.x, event.y): return False
      path, col, x, y =  widget.get_path_at_pos(event.x,event.y)
      R = self.stepList.get_cell_area(path,col)
      if x >= R.x and x <= R.x + R.width:
        it = self.stepStore.get_iter(path)
        if self.stepStore[it][0] == self.iconStop:
          self.stepStore[it][0] = None
        else:
          self.stepStore[it][0] = self.iconStop
        return True
      return False
    
    def on_window_destroy(self, widget, data=None):
        self.tearDown()
        Gtk.main_quit()
        
    def on_SingleStep_clicked(self, widget, data=None):
      selection = self.stepList.get_selection()
      it = selection.get_selected()[1]
      row = self.stepStore.get_path(it)[0]
      if it is not None:
        try:
          self.runStep(self.dataScript[0][row])
          self.stepStore[it][3] = self.iconPass
        except AssertionError, e:
          self.logError(row,e)
          self.stepStore[it][3] = self.iconFail

    def on_Execute_clicked(self, widget, data=None):
      selection = self.stepList.get_selection()
      it = selection.get_selected()[1]   
      while it != None:
         self.stepStore[it][3] = self.iconNotTested
         it = self.stepStore.iter_next(it)
      while Gtk.events_pending(): Gtk.main_iteration()
      self.tag = self.driver
      it = selection.get_selected()[1]       
      i = self.stepStore.get_path(it)[0]
      self.paused = False
      while i < len(self.dataScript[0]):
        if self.paused == True: break
        if self.stepStore[it][0] is not None: break
        if self.stepStore[it][2] is True:
          it = self.stepStore.iter_next(it)
          i += 1
          continue
        path = self.stepStore.get_path(it)
        self.stepList.set_cursor(path)
        self.stepList.scroll_to_cell(path)
        try:
          self.runStep(self.dataScript[0][i])
          self.stepStore[it][3] = self.iconPass
        except AssertionError, e:
          self.logError(i,e)
          self.stepStore[it][3] = self.iconFail

        it = self.stepStore.iter_next(it)          
        while Gtk.events_pending(): Gtk.main_iteration()
        i = i + 1

    def on_GoToTop_clicked(self, widget, data=None):
      path = self.stepStore.get_path(self.stepStore.get_iter_first())
      self.stepList.set_cursor(path)

    def on_Pause_clicked(self, widget, data=None):
      self.paused = True      
          
    def on_skip_clicked(self,cell,path, model, *ignore):
      if path is not None:
        it = model.get_iter(path)
        model[it][2] = not model[it][2]
          
    def setUp(self):
        self.driver = webdriver.Firefox()
        self.exc_type, self.exc_value, self.exc_traceback = sys.exc_info()
    
    def verifyPage(self,name):
    	driver = self.driver
    	time.sleep(.1)
    	if name == "Home":
				elem = driver.find_elements_by_tag_name("img")
				for e in elem:
				  if e.get_attribute("src") == \
				        "https://test.buildbotics.com/images/buildbotics_explore_learn_create.png":
						return e
				return False
		    
    def logMessage(self,msg):
      it = self.messageBuffer.get_end_iter()
      self.messageBuffer.insert(it,'\n' + msg,-1)
      self.messageLog.scroll_mark_onscreen(self.messageBuffer.get_insert())

    def logError(self,index,e):
      step = self.dataScript[0][index]
      errString = "Step {0}: ".format(index)
      if e.message: errString = errString + e.message
      if step.get("errMsg"): errString = errString + '\n' + step["errMsg"]
      self.logMessage(errString)
    
    def openSite(self,step):
      self.driver.get(step["value"])
      self.logMessage("Opening " + step["value"])
      
    def findTag(self,base,step):
      if step["criteria"] == "id":
        return base.find_element_by_id(step["value"])
      elif step["criteria"] == "tag":
        return base.find_element_by_tag_name(step["value"])
      elif step["criteria"] == "class":
        return base.find_element_by_class_name(step["value"])
      elif step["criteria"] == "link text":
        return base.find_element_by_partial_link_text(step["value"])
      elif step["criteria"] == "text":
        elem = base.find_elements_by_css_selector("a")
        for e in elem: 
          if step["value"] == e.text: return e
        self.assertTrue(False,"Tag: " + step["value"] + ": NOT FOUND")
      else:
        self.assertTrue(False,"SCRIPT ERROR: unknown tag criteria:" + step["criteria"])
        
    def assertion(self,tag,step):
      if step["criteria"] == "src":
        self.assertTrue(tag.get_attribute(step["criteria"]) == step["value"],\
               "Tag source: " + step["value"] + " not found in current tag")
      elif step["criteria"] == "is_displayed":
        self.assertTrue(tag.is_displayed(),"Tag: is not displayed")
      elif step["criteria"] == "text":
        self.assertIn(step["value"],tag.text,\
                step["value"] + " not found in '" + tag.text + "'")
      else:
        self.assertTrue(False,"WARNING: unknown assertion criteria: " + step["criteria"])
        
    def setTestName(self,name):
      self.logMessage("Test Name: " + name)
		
    def runStep(self, step):
		    type = step["type"]
		    if type == "testName": self.setTestName(step["value"])
		    elif type == "openSite": self.openSite(step)
		    elif type == "find":   self.tag = self.findTag(self.driver,step)
		    elif type == "findSub":self.tag = self.findTag(self.tag,step)
		    elif type == "assert": self.assertion(self.tag,step)
		    elif type == "click":  self.tag.click()
		    elif type == "wait":   time.sleep(eval(step["value"]))
		    elif type == "back":   self.driver.back()
		    elif type == "refresh":self.driver.refresh()
		    elif type == "goto":   self.driver.get(step["value"])
		    else:
		      self.assertTrue(False,"SCRIPT ERROR: unknown action type: " + type)
        
    def runner(self,ts):
      tag = self.driver
      errCount = 0;
      j = 1
      i = 1
      while i < len(ts):
        try:
          type = ts[i]["type"]
          if type == "openSite":
            self.openSite(ts[i])
          elif type == "find":
            tag = self.findTag(self.driver,ts[i])
          elif type == "findSub":
            tag = self.findTag(tag,ts[i])
          elif type == "assert":
              self.assertion(tag,ts[i])
          elif type == "click":
            tag.click()
          elif type == "wait":
            time.sleep(eval(ts[i]["value"]))
          elif type == "back":
            self.driver.back()
          elif type == "refresh":
            self.driver.refresh()
          elif "goto":
            self.driver.get(ts[i]["value"])
          else:
            print "unknown action type: " + type
        except:
          errCount = errCount + 1
          if ts[i].get("errMsg"):
            print "ERROR: " + ts[i]["errMsg"]
          else: print "ERROR: Unable to " + ts[i]["type"]
          if ts[i].get("skip"):
            i = i + eval(ts[i]["skip"])
        j = j + 1
        i += 1
      print "\nRESULTS FOR: " + ts[0]["value"]
      print "     {0} error(s) detected".format(errCount)
      print "     {0} out of {1} steps executed".format(j,i)

    def tearDown(self):
        self.driver.close()


if __name__ == "__main__":   
    TR = TestRunner()
    TR.window.show()
    Gtk.main()

    
    
